using CertiPath.BlockchainGateway.LDAP.Constants;
using System;
using System.Collections.Generic;
using System.DirectoryServices.Protocols;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;

namespace CertiPath.BlockchainGateway.LDAP.Helper
{
    public class SID
    {
        public static string Get(SearchResultEntry entry)
        {
            if (entry.Attributes[AttributeNames.Sid] != null)
            {
                byte[] bSid = (byte[])entry.Attributes[AttributeNames.Sid][0];
                var sid = new SecurityIdentifier(bSid, 0);
                return sid.ToString();
            }
            return "";
        }
    }
}
