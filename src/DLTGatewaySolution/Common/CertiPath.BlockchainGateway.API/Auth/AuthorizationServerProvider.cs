using Microsoft.Owin.Security;
using Microsoft.Owin.Security.OAuth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNet.Identity.EntityFramework;
using CertiPath.BlockchainGateway.Model;
using CertiPath.BlockchainGateway.DataLayer;
using System.DirectoryServices.AccountManagement;
using System.IO;
using System.Web.Helpers;
using System.Collections.Specialized;

namespace CertiPath.BlockchainGateway.API.Auth
{
    public class AuthorizationServerProvider : OAuthAuthorizationServerProvider
    {
        public override async Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            context.Validated();
        }

        public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {
            context.OwinContext.Response.Headers.Add("Access-Control-Allow-Origin", new[] { "*" });
            CertiPath.BlockchainGateway.Service.Helper.Common.EntityConverter converter = new Service.Helper.Common.EntityConverter();

            try
            {
                using (DataLayer.DataModelContainer dbContext = DataLayer.DataModelContainer.Builder().Build())
                {
                    // must read the entire payload since domain is not a standard field
                    context.Request.Body.Position = 0;
                    var payload = new StreamReader(context.Request.Body).ReadToEnd();
                    NameValueCollection parsedPayload = HttpUtility.ParseQueryString(payload);

                    string domain = parsedPayload["Domain"];
                    string username = parsedPayload["UserName"];
                    string password = parsedPayload["Password"];

                    string firstName = "";
                    string lastName = "";
                    string email = "";
                    List<UserAdGroupModel> groupList = new List<UserAdGroupModel>();
                    bool isSuperAdmin = false;
                    bool isGlobalAdmin = false;
                    bool isGlobalView = false;

                    bool validCredentials = false;
                    using (PrincipalContext pc = new PrincipalContext(ContextType.Domain, domain))
                    {
                        // validate the credentials
                        validCredentials = pc.ValidateCredentials(username, password);

                        if (validCredentials)
                        {
                            UserPrincipal up = new UserPrincipal(pc);
                            PrincipalSearcher search = new PrincipalSearcher(up);

                            IEnumerable<System.DirectoryServices.AccountManagement.Principal> collsearch = search.FindAll()
                                                                                                                    .Where(a => a.SamAccountName != null && a.DisplayName != null)
                                                                                                                    .Where(a => a.SamAccountName.ToUpper().Contains(username.ToUpper()) ||
                                                                                                                        a.DisplayName.ToUpper().Contains(username.ToUpper()));
                            foreach (UserPrincipal result in collsearch)
                            {
                                firstName = result.GivenName;
                                lastName = result.Surname;
                                email = result.EmailAddress;

                                // get groups
                                PrincipalSearchResult<Principal> groups = result.GetAuthorizationGroups();
                                var group = groups.GetEnumerator();

                                // get all global admin groups
                                // get all global view groups
                                Service.Role roleService = new Service.Role(dbContext);
                                List<UserGroupRoleModel> globalAdminGroups = roleService.GetUserGroupsByRoleName(Helper.Contstants.ROLE_GLOBAL_ADMIN, true);
                                List<UserGroupRoleModel> globalViewGroups = roleService.GetUserGroupsByRoleName(Helper.Contstants.ROLE_GLOBAL_VIEW, true);

                                using (group)
                                {
                                    while (group.MoveNext())
                                    {
                                        try
                                        {
                                            Principal p = group.Current;
                                            if (p.Name.Trim() != "")
                                            {
                                                groupList.Add(new UserAdGroupModel()
                                                {
                                                    DistinguishedName = p.DistinguishedName,
                                                    Name = p.Name,
                                                    SamAccountName = p.SamAccountName,
                                                    Sid = p.Sid.Value
                                                });

                                                if (p.SamAccountName.ToLower() == "Domain Admins".ToLower())
                                                {
                                                    isSuperAdmin = true;
                                                }

                                                // global admin
                                                if (isGlobalAdmin == false)
                                                {
                                                    foreach (var globalAdmin in globalAdminGroups)
                                                    {
                                                        if (globalAdmin.UserGroupSID.ToUpper().Trim() == p.Sid.Value.ToUpper().Trim())
                                                        {
                                                            isGlobalAdmin = true;
                                                            break;
                                                        }
                                                    }
                                                }

                                                // global view
                                                if (isGlobalView == false)
                                                {
                                                    foreach (var globalView in globalViewGroups)
                                                    {
                                                        if (globalView.UserGroupSID.ToUpper().Trim() == p.Sid.Value.ToUpper().Trim())
                                                        {
                                                            isGlobalView = true;
                                                            break;
                                                        }
                                                    }
                                                }
                                            }
                                            Console.WriteLine(p.Name);
                                        }
                                        catch (NoMatchingPrincipalException pex)
                                        {
                                            continue;
                                        }
                                    }
                                }
                                break;
                            }
                        }
                    }

                    // the entire claims functionality breaks if you try to insert empty values into claims
                    // not sure why it is that way, but "N/A"s below are for that reason
                    AuthenticationResponseModel res = new AuthenticationResponseModel()
                    {
                        IsAuthenticated = validCredentials,
                        Username = username,
                        FirstName = (firstName == null || firstName.Trim() == "") ? "N/A" : firstName,
                        LastName = (lastName == null || lastName.Trim() == "") ? "N/A" : lastName,
                        Email = (email == null || email.Trim() == "") ? "N/A" : email,
                        IsSuperAdmin = isSuperAdmin,
                        IsGlobalAdmin = isGlobalAdmin,
                        IsGlobalView = isGlobalView
                    };
                    if (res.IsAuthenticated)
                    {
                        CertiPath.BlockchainGateway.Service.User userSrv = new Service.User(dbContext);
                        UserModel user = userSrv.FindByDomainAndUsername(domain, username);
                        if (user == null)
                        {
                            user = userSrv.CreateNew(new UserModel()
                            {
                                Domain = domain,
                                Username = username,
                                Email = email,
                                FirstName = firstName,
                                LastName = lastName
                            });
                        }
                        res.GUID = user.GUID;
                        userSrv.CreateLoginLog(user);
                    }
                    
                    if (res.IsAuthenticated)
                    {
                        var identity = new ClaimsIdentity(context.Options.AuthenticationType);
                        identity.AddClaim(new Claim("User", converter.GetJson(res)));

                        // get AD connection info
                        LDAPConnectionModel adc = getActiveDirectoryConnection(dbContext);
                        identity.AddClaim(new Claim("ADConnection", converter.GetJson(adc)));

                        var props = new AuthenticationProperties(new Dictionary<string, string>());
                        props.Dictionary.Add("IsAuthenticated", Boolean.TrueString);
                        props.Dictionary.Add("UserFirstName", res.FirstName);
                        props.Dictionary.Add("UserLastName", res.LastName);
                        props.Dictionary.Add("UserEmail", res.Email);
                        props.Dictionary.Add("UserName", domain + "/" + username);
                        props.Dictionary.Add("IsSuperAdmin", isSuperAdmin.ToString().ToUpper());

                        var ticket = new AuthenticationTicket(identity, props);
                        context.Validated(ticket);
                    }
                }
            }
            catch (Exception exc)
            {
                Log.Error("AuthServerProvider - Error", exc);
                context.SetError("System error. Contact your administrator");
            }
        }

        private LDAPConnectionModel getActiveDirectoryConnection(DataModelContainer dbContext)
        {
            var adList = dbContext.Setting.Where(w => w.SettingType.Name == "AD").ToList();
            LDAPConnectionModel connection = new LDAPConnectionModel();
            connection.AuthType = adList.Where(w => w.Name == "AD_AuthType").SingleOrDefault().Value;
            connection.BaseDirectory = adList.Where(w => w.Name == "AD_BaseDirectory").SingleOrDefault().Value;
            connection.PageSize = adList.Where(w => w.Name == "AD_PageSize").SingleOrDefault().Value == "" ? 10 : Convert.ToInt32(adList.Where(w => w.Name == "AD_PageSize").SingleOrDefault().Value);
            connection.Password = adList.Where(w => w.Name == "AD_Password").SingleOrDefault().Value;
            connection.Username = adList.Where(w => w.Name == "AD_Username").SingleOrDefault().Value;
            connection.Server = adList.Where(w => w.Name == "AD_Server").SingleOrDefault().Value;
            connection.Port = adList.Where(w => w.Name == "AD_Port").SingleOrDefault().Value.Trim() == "" ? 
                                        3268 : Convert.ToInt32(adList.Where(w => w.Name == "AD_Port").SingleOrDefault().Value);
            return connection;
        }

        public override Task TokenEndpoint(OAuthTokenEndpointContext context)
        {
            // for additional properties I want to return alongside the token
            foreach (KeyValuePair<string, string> property in context.Properties.Dictionary)
            {
                context.AdditionalResponseParameters.Add(property.Key, property.Value);
            }
            return Task.FromResult<object>(null);
        }
    }
}
 