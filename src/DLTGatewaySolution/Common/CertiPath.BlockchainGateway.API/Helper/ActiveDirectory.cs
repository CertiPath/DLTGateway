using CertiPath.BlockchainGateway.DataLayer;
using CertiPath.BlockchainGateway.Model;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Web;

namespace CertiPath.BlockchainGateway.API.Helper
{
    internal class ActiveDirectory
    {
        internal LDAPConnectionModel GetConnection()
        {
            LDAPConnectionModel connection = new LDAPConnectionModel();
            ClaimsPrincipal principal = HttpContext.Current.User as ClaimsPrincipal;
            if (null != principal)
            {
                foreach (Claim claim in principal.Claims)
                {
                    if (claim.Type.ToUpper() == "ADCONNECTION")
                    {
                        connection = JsonConvert.DeserializeObject<LDAPConnectionModel>(claim.Value);
                        break;
                    }
                }
            }
            return connection;
        }

        internal LDAPConnectionModel GetActiveDirectoryConnection(DataModelContainer dbContext)
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
    }
}