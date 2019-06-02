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

        internal List<Model.LDAPGroupModel> GetSecurityGroupsByDN(string dn)
        {
            LDAPConnectionModel adConnection = GetActiveDirectoryConnection(DataLayer.DataModelContainer.Builder().Build());
            adConnection.PageSize = 200;
            LDAP.Group ldapGroup = new LDAP.Group(adConnection);

            // all security groups for this user
            string filter = String.Format("(&(member={0})(groupType:1.2.840.113556.1.4.803:=2147483648))", dn);
            bool lEnd = false;
            List<Model.LDAPGroupModel> groups = ldapGroup.GetByFilter(filter, 1, 200, out lEnd);

            // TODO: at some point this should be fixed, but it is low priority. It issumes that a user will not belong 
            // to more than 200 groups. We should paginate if there are more records than that
            if (lEnd == false)
            {
                Log.Info("WARNING: AD GetSecurityGroupsByDN - assuming that user will not have more than 200 security groups, but in this case it seems not to be the case: " + dn);
            }

            return groups;
        }
    }
}