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

                    bool validCredentials = false;
                    using (PrincipalContext pc = new PrincipalContext(ContextType.Domain, domain))
                    {
                        // validate the credentials
                        validCredentials = pc.ValidateCredentials(username, password);
                    }

                    AuthenticationResponseModel res = new AuthenticationResponseModel()
                    {
                        IsAuthenticated = validCredentials,
                        Username = username,
                        FirstName = "",
                        LastName = "",
                        Email = ""
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
                                Email = ""
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
 