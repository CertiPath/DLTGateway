using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CertiPath.BlockchainGateway.Model
{
    public class LDAPConnectionModel
    {
        public string Server { get; set; }
        public int Port { get; set; }
        public string Domain { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string BaseDirectory { get; set; }
        public int ProtocolVersion { get; set; }
        public string AuthType { get; set; }

        public int PageSize { get; set; }
    }

    public class LDAPUserModel
    {
        public bool Active { get; set; }
        public string SID { get; set; }
        public string Name { get; set; }
        public string UPN { get; set; }
        public string DistinguishedName { get; set; }
        public string SAMAccountName { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string msExchRecipientTypeDetails { get; set; }
        public string msDSPrincipalName { get; set; }

        public string Title { get; set; }
        public string Office { get; set; }
        public string Company { get; set; }
        public string Phone { get; set; }
        public string Department { get; set; }
        public string Manager { get; set; }
        public string Initials { get; set; }
        public string DisplayName { get; set; }
        public string ThumbnailPhoto { get; set; }
        public string EmployeeID { get; set; }
        public string MiddleName { get; set; }

        public List<LDAPGroupModel> GroupList { get; set; }
    }

    public class LDAPGroupModel
    {
        public string Name { get; set; }
        public string ID { get; set; }
        public string SID { get; set; }
        public string Domain { get; set; }
        public string Email { get; set; }
        public string msExchRecipientTypeDetails { get; set; }
        public string msDSPrincipalName { get; set; }

        public List<LDAPGroupModel> ChildGroups { get; set; }
    }

    public class LDAPDomainModel
    {
        public string Name { get; set; }
        public string DistinguishedName { get; set; }
        public string SID { get; set; }
        public string DomainName { get; set; }
        public string CanonicalName { get; set; }
    }

    public class ADDomainModel
    {
        public System.Guid GUID { get; set; }
        public string Name { get; set; }
        public string DisplayName { get; set; }
        public string Discription { get; set; }
        public string DistinguishedName { get; set; }
        public string SID { get; set; }
    }
}
