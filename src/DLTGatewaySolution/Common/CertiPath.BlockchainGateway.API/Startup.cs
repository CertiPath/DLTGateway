using CertiPath.BlockchainGateway.API.Auth;
using Microsoft.Owin;
using Microsoft.Owin.Security.OAuth;
using Owin;
using System;
using System.Web;
using System.Web.Http;

[assembly: OwinStartup(typeof(CertiPath.BlockchainGateway.API.Startup))]
namespace CertiPath.BlockchainGateway.API
{
    public class Startup
    {
        
        public void ConfigureAuth(IAppBuilder app)
        {
            var OAuthOptions = new OAuthAuthorizationServerOptions
            {
                AllowInsecureHttp = true,                       // TODO: Should probably change this in production
                TokenEndpointPath = new PathString("/api/oauth2/token"),
                AccessTokenExpireTimeSpan = TimeSpan.FromMinutes(120),
                Provider = new AuthorizationServerProvider()
            };

            // Token Generation
            //app.UseOAuthBearerTokens(OAuthOptions);
            app.UseOAuthAuthorizationServer(OAuthOptions);
            app.UseOAuthBearerAuthentication(new OAuthBearerAuthenticationOptions());

            //HttpConfiguration config = new HttpConfiguration();
            //WebApiConfig.Register(config);
        }

        public void Configuration(IAppBuilder app)
        {
            HttpConfiguration config = new HttpConfiguration();

            ConfigureAuth(app);

            WebApiConfig.Register(config);
            app.UseCors(Microsoft.Owin.Cors.CorsOptions.AllowAll);
            app.UseWebApi(config);

            //ConfigureAuth(app);
            //GlobalConfiguration.Configure(WebApiConfig.Register);;
        }
    }
}