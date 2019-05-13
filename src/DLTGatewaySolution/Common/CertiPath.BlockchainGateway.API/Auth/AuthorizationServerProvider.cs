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

            using (DataLayer.DataModelContainer dbContext = DataLayer.DataModelContainer.Builder().Build())
            {
                CertiPath.BlockchainGateway.Service.Authenticate authSrv = new Service.Authenticate(dbContext);
                var res = authSrv.Login(new AuthenticationModel()
                {
                    Username = context.UserName,
                    Password = context.Password
                });
                if (res.IsAuthenticated)
                {
                    var identity = new ClaimsIdentity(context.Options.AuthenticationType);
                    identity.AddClaim(new Claim("sub", context.UserName));

                    // get AD connection info
                    LDAPConnectionModel adc = getActiveDirectoryConnection(dbContext);
                    identity.AddClaim(new Claim("ADConnection", converter.GetJson(adc)));

                    var props = new AuthenticationProperties(new Dictionary<string, string>());
                    props.Dictionary.Add("IsAuthenticated", Boolean.TrueString);
                    props.Dictionary.Add("UserFirstName", res.FirstName);
                    props.Dictionary.Add("UserLastName", res.LastName);
                    props.Dictionary.Add("UserEmail", res.Email);

                    var ticket = new AuthenticationTicket(identity, props);
                    context.Validated(ticket);
                }
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
            connection.Port = Convert.ToInt32(adList.Where(w => w.Name == "AD_Port").SingleOrDefault().Value);
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