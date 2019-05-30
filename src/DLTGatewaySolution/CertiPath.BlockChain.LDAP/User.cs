using CertiPath.BlockchainGateway.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.DirectoryServices.Protocols;
using CertiPath.BlockchainGateway.LDAP.Constants;
using CertiPath.BlockchainGateway.LDAP;

namespace CertiPath.BlockchainGateway.LDAP
{
    public class User : IDisposable
    {
        private LdapConnection _ldapConnection;
        private LDAPConnectionModel _ldapConnectionInfo;
        
        public User(LDAPConnectionModel m)
        {
            _ldapConnectionInfo = m;
            _ldapConnection = BlockChain.LDAP.Helper.Connection.Init(m);
            
        }

        #region Dispose

        private bool _disposed;

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (_disposed)
            {
                return;
            }

            if (disposing)
            {
                // free other managed objects that implement
                // IDisposable only
                _ldapConnection.Dispose();
            }

            // release any unmanaged objects

            _disposed = true;
        }

        #endregion Dispose

        public LDAPUserModel GetBySID(string sid, string directoryToSearch, bool includeGroups)
        {
            string customFilter = String.Format("(objectSid={0})", sid);
            bool reachedEnd = false;
            var res = GetAll(directoryToSearch, 1, 1, true, customFilter, out reachedEnd, "");
            if (res.Count > 0)
            {
                return res[0];
            }
            return null;
        }

        public List<LDAPUserModel> GetAll(string directoryToSearch, int start, int pageSize, bool includeGroups, out bool reachedEnd, string EmployeeIdAttribute)
        {
            return GetAll(directoryToSearch, start, pageSize, includeGroups, "", out reachedEnd, EmployeeIdAttribute);
        }

        public List<LDAPUserModel> GetAll(string directoryToSearch, int start, int pageSize, bool includeGroups, string customFilter, out bool reachedEnd, string EmployeeIdAttribute)
        {
            List<LDAPUserModel> res = new List<LDAPUserModel>();
            string filter = "(&(objectCategory=person)(objectClass=user)" + customFilter + ")";

            var request = new SearchRequest(
                                        directoryToSearch,
                                        filter,
                                        System.DirectoryServices.Protocols.SearchScope.Subtree,
                                        null);

            request.Attributes.Add(AttributeNames.Sid);
            request.Attributes.Add(AttributeNames.msDSPrincipalName);
            request.Attributes.Add(AttributeNames.Name);
            request.Attributes.Add(AttributeNames.Upn);
            request.Attributes.Add(AttributeNames.San);
            request.Attributes.Add(AttributeNames.Email);
            request.Attributes.Add(AttributeNames.LastName);
            request.Attributes.Add(AttributeNames.FirstName);
            request.Attributes.Add(AttributeNames.msExchRecipientTypeDetails);
            request.Attributes.Add(AttributeNames.MiddleName);
            request.Attributes.Add(AttributeNames.Title);
            request.Attributes.Add(AttributeNames.Office);
            request.Attributes.Add(AttributeNames.Company);
            request.Attributes.Add(AttributeNames.Phone);
            request.Attributes.Add(AttributeNames.Department);
            request.Attributes.Add(AttributeNames.Manager);
            request.Attributes.Add(AttributeNames.Initials);
            request.Attributes.Add(AttributeNames.DisplayName);
            request.Attributes.Add(AttributeNames.ThumbnailPhoto);
            request.Attributes.Add(AttributeNames.UserAccountControl);
            if (EmployeeIdAttribute != "")
            {
                request.Attributes.Add(EmployeeIdAttribute);
            }
            if (includeGroups)
            {
                request.Attributes.Add(AttributeNames.Groups);
            }

            var pageResultRequestControl = new PageResultRequestControl(pageSize);
            request.Controls.Add(pageResultRequestControl);

            // turn off referral chasing so pagination works
            SearchOptionsControl searchOptions = new SearchOptionsControl(SearchOption.DomainScope);

            // add the SearchOptionsControl object to the
            // SearchRequest object's directory control collection
            // to disable referral chasing
            request.Controls.Add(searchOptions);

            int currentPage = 0;
            int pageNumber = start / pageSize + 1;

            while (true)
            {
                currentPage++;
                var response = (SearchResponse)_ldapConnection.SendRequest(request);
                var pageResponse = (PageResultResponseControl)response.Controls[0];

                if (currentPage == pageNumber || pageResponse.Cookie.Length == 0)
                {
                    reachedEnd = pageResponse.Cookie.Length == 0;
                    foreach (SearchResultEntry entry in response.Entries)
                    {
                        LDAPUserModel user = getAttributesFromEntry(entry, EmployeeIdAttribute);
                        if (includeGroups)
                        {
                            if (entry.Attributes[AttributeNames.Groups] != null)
                            {
                                user.GroupList = new List<LDAPGroupModel>();
                                for (int index = 0; index < entry.Attributes[AttributeNames.Groups].Count; index++)
                                {
                                    Group grp = new Group(_ldapConnectionInfo);
                                    LDAPGroupModel group = grp.GetByDistinguishedName(entry.Attributes[AttributeNames.Groups][index].ToString());
                                    if (group != null)
                                    {
                                        user.GroupList.Add(group);
                                    }
                                }
                            }
                        }

                        res.Add(user);
                    }
                    break;
                }
                else
                {
                    pageResultRequestControl.Cookie = pageResponse.Cookie;
                }
            }
            return res;
        }

        public LDAPUserModel GetByPrincipalName(string directoryToSearch, string userPrincipalName, string EmployeeIdAttribute)
        {
            var request = new SearchRequest(
                                        directoryToSearch,
                                        "(userPrincipalName=" + userPrincipalName + ")",
                                        System.DirectoryServices.Protocols.SearchScope.Subtree,
                                        null);

            LDAPUserModel res = searchResponse(request, EmployeeIdAttribute);
            return res;
        }

        public LDAPUserModel GetByDistinguishedName(string dn, string EmployeeIdAttribute)
        {
            // "(userPrincipalName=" + "*" + ")"
            var request = new SearchRequest(dn, "(objectClass=*)", System.DirectoryServices.Protocols.SearchScope.Subtree, null);
            LDAPUserModel res = searchResponse(request, EmployeeIdAttribute);
            return res;
        }

        private LDAPUserModel searchResponse(SearchRequest request, string EmployeeIdAttribute)
        {
            LDAPUserModel res = new LDAPUserModel();
            try
            {
                var response = (SearchResponse)_ldapConnection.SendRequest(request);
                foreach (SearchResultEntry entry in response.Entries)
                {
                    res = getAttributesFromEntry(entry, EmployeeIdAttribute);

                    // get groups to which this user belongs
                    res.GroupList = new List<LDAPGroupModel>();
                    if (entry.Attributes[AttributeNames.Groups] != null)
                    {
                        if (entry.Attributes[AttributeNames.Groups].Count > 0)
                        {
                            for (int index = 0; index < entry.Attributes[AttributeNames.Groups].Count; index++)
                            {
                                LDAPGroupModel group = new LDAPGroupModel();
                                String groupName = entry.Attributes[AttributeNames.Groups][index].ToString();
                                group.Name = groupName;

                                res.GroupList.Add(group);
                            }
                        }
                    }
                    return res;
                }
            }
            catch (Exception exc)
            {
                // if an object (user) cannot be found an exception will br thrown
                // to us that just means that the user is not there
            }
            return null;
        }

        private LDAPUserModel getAttributesFromEntry(SearchResultEntry entry, string EmployeeIdAttribute)
        {
            LDAPUserModel res = new LDAPUserModel();

            res.SID = BlockchainGateway.LDAP.Helper.SID.Get(entry);
            res.DistinguishedName = entry.DistinguishedName;
            res.Name = entry.Attributes[AttributeNames.Name][0].ToString();
            res.UPN = entry.Attributes[AttributeNames.Upn] != null ? entry.Attributes[AttributeNames.Upn][0].ToString() : "";
            res.SAMAccountName = entry.Attributes[AttributeNames.San][0].ToString();
            res.Email = entry.Attributes[AttributeNames.Email] == null ? "" : entry.Attributes[AttributeNames.Email][0].ToString();
            res.LastName = entry.Attributes[AttributeNames.LastName] != null ? entry.Attributes[AttributeNames.LastName][0].ToString() : "";
            res.FirstName = entry.Attributes[AttributeNames.FirstName] != null ? entry.Attributes[AttributeNames.FirstName][0].ToString() : "";
            res.Email = entry.Attributes[AttributeNames.Email] != null ? entry.Attributes[AttributeNames.Email][0].ToString() : "";
            res.msExchRecipientTypeDetails = entry.Attributes[AttributeNames.msExchRecipientTypeDetails] != null ? entry.Attributes[AttributeNames.msExchRecipientTypeDetails][0].ToString() : "";
            res.msDSPrincipalName = entry.Attributes[AttributeNames.msDSPrincipalName] != null ? entry.Attributes[AttributeNames.msDSPrincipalName][0].ToString() : "";
            res.MiddleName = entry.Attributes[AttributeNames.MiddleName] != null ? entry.Attributes[AttributeNames.MiddleName][0].ToString() : "";

            res.Active = isActive(entry);

            res.Title = entry.Attributes[AttributeNames.Title] == null ? "" : entry.Attributes[AttributeNames.Title][0].ToString();
            res.Office = entry.Attributes[AttributeNames.Office] == null ? "" : entry.Attributes[AttributeNames.Office][0].ToString();
            res.Company = entry.Attributes[AttributeNames.Company] == null ? "" : entry.Attributes[AttributeNames.Company][0].ToString();
            res.Phone = entry.Attributes[AttributeNames.Phone] == null ? "" : entry.Attributes[AttributeNames.Phone][0].ToString();
            res.Department = entry.Attributes[AttributeNames.Department] == null ? "" : entry.Attributes[AttributeNames.Department][0].ToString();
            res.Manager = entry.Attributes[AttributeNames.Manager] == null ? "" : entry.Attributes[AttributeNames.Manager][0].ToString();
            res.Initials = entry.Attributes[AttributeNames.Initials] == null ? "" : entry.Attributes[AttributeNames.Initials][0].ToString();
            res.DisplayName = entry.Attributes[AttributeNames.DisplayName] == null ? "" : entry.Attributes[AttributeNames.DisplayName][0].ToString();
            res.ThumbnailPhoto = entry.Attributes[AttributeNames.ThumbnailPhoto] == null ? "" : entry.Attributes[AttributeNames.ThumbnailPhoto][0].ToString();

            if (EmployeeIdAttribute != "")
            {
                try
                {
                    res.EmployeeID = entry.Attributes[EmployeeIdAttribute] == null ? "" : entry.Attributes[EmployeeIdAttribute][0].ToString();
                }
                catch (Exception exc)
                {
                }
            }

            return res;
        }

        private bool isActive(SearchResultEntry entry)
        {
            if (entry.Attributes["userAccountControl"] == null)
            {
                return false;
            }

            int flags = Convert.ToInt32(entry.Attributes["userAccountControl"][0].ToString());
            return !Convert.ToBoolean(flags & 0x0002); //Checks the disabled flag
        }

    }
}
