using CertiPath.BlockChain.LDAP.Helper;
using CertiPath.BlockchainGateway.LDAP.Constants;
using CertiPath.BlockchainGateway.LDAP.Helper;
using CertiPath.BlockchainGateway.Model;
using System;
using System.Collections.Generic;
using System.DirectoryServices.Protocols;
using System.Security.Principal;


namespace CertiPath.BlockchainGateway.LDAP
{
    public class Group : IDisposable
    {
        private LdapConnection _ldapConnection;
        private Model.LDAPConnectionModel _ldapConnectionInfo;

        public Group(Model.LDAPConnectionModel m, bool takeConnectionStringFromConfig)
        {
            _ldapConnectionInfo = m;
            _ldapConnection = Connection.Init(m, takeConnectionStringFromConfig);
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

        public List<Model.LDAPGroupModel> GetAll()
        {
            List<Model.LDAPGroupModel> res = new List<Model.LDAPGroupModel>();
            var request = new SearchRequest(_ldapConnectionInfo.BaseDirectory, "(&(objectClass=group))", System.DirectoryServices.Protocols.SearchScope.Subtree, null);
            var response = (SearchResponse)_ldapConnection.SendRequest(request);
            foreach (SearchResultEntry entry in response.Entries)
            {
                Model.LDAPGroupModel group = new Model.LDAPGroupModel();
                group.ID = entry.DistinguishedName;
                group.Name = entry.Attributes[AttributeNames.Name][0].ToString();
                res.Add(group);
            }
            return res;
        }

        public List<Model.LDAPGroupModel> GetAllSecurityDomainLocal(int start, int pageSize, out bool reachedEnd)
        {
            return GetByFilter("(&(objectCategory=group)(groupType:1.2.840.113556.1.4.803:=2147483652))", start, pageSize, out reachedEnd);
        }

        public List<Model.LDAPGroupModel> GetAllSecurityUniversal(int start, int pageSize, out bool reachedEnd)
        {
            return GetByFilter("(&(objectCategory=group)(groupType:1.2.840.113556.1.4.803:=2147483656))", start, pageSize, out reachedEnd);
        }

        public List<Model.LDAPGroupModel> GetAllSecurityGlobal(int start, int pageSize, out bool reachedEnd)
        {
            return GetByFilter("(&(objectCategory=group)(groupType:1.2.840.113556.1.4.803:=2147483650))", start, pageSize, out reachedEnd);
        }

        public List<Model.LDAPGroupModel> GetAllDistributionUniversal(int start, int pageSize, out bool reachedEnd)
        {
            return GetByFilter("(&(objectCategory=group)(groupType:1.2.840.113556.1.4.803:=8)(!(groupType:1.2.840.113556.1.4.803:=2147483648)))", start, pageSize, out reachedEnd);
        }

        public List<Model.LDAPGroupModel> GetAllDistributionDomainLocal(int start, int pageSize, out bool reachedEnd)
        {
            return GetByFilter("(&(objectCategory=group)(groupType:1.2.840.113556.1.4.803:=4)(!(groupType:1.2.840.113556.1.4.803:=2147483648)))", start, pageSize, out reachedEnd);
        }

        public List<Model.LDAPGroupModel> GetAllDistributionGlobal(int start, int pageSize, out bool reachedEnd)
        {
            return GetByFilter("(&(objectCategory=group)(groupType:1.2.840.113556.1.4.803:=2)(!(groupType:1.2.840.113556.1.4.803:=2147483648)))", start, pageSize, out reachedEnd);
        }

        public List<Model.LDAPGroupModel> GetAllDistribution(int start, int pageSize, out bool reachedEnd)
        {
            return GetByFilter("(&(objectClass=group)(!(groupType:1.2.840.113556.1.4.803:=2147483648)))", start, pageSize, out reachedEnd);
        }

        public List<Model.LDAPGroupModel> GetAllSecurity(int start, int pageSize, out bool reachedEnd)
        {
            return GetByFilter("(&(objectClass=group)((groupType:1.2.840.113556.1.4.803:=2147483648)))", start, pageSize, out reachedEnd);
        }

        public List<Model.LDAPGroupModel> GetByFilter(string filter, int page, int pageSize, out bool reachedEnd)
        {
            List<Model.LDAPGroupModel> res = new List<Model.LDAPGroupModel>();
            var request = new SearchRequest(_ldapConnectionInfo.BaseDirectory, filter, System.DirectoryServices.Protocols.SearchScope.Subtree, null);

            request.Attributes.Add(AttributeNames.Sid);
            request.Attributes.Add(AttributeNames.Name);
            request.Attributes.Add(AttributeNames.Email);
            request.Attributes.Add(AttributeNames.msExchRecipientTypeDetails);
            request.Attributes.Add(AttributeNames.msDSPrincipalName);
            request.Attributes.Add(AttributeNames.Member);
            request.Attributes.Add(AttributeNames.ObjectClass);

            var pageResultRequestControl = new PageResultRequestControl(pageSize);
            request.Controls.Add(pageResultRequestControl);

            int currentPage = 0;
            int pageNumber = page;
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
                        LDAPGroupModel group = GetAttributesFromEntry(entry);
                        if (entry.Attributes[AttributeNames.Member] != null)
                        {
                            if (entry.Attributes[AttributeNames.Member].Count > 0)
                            {
                                group.ChildGroups = new List<LDAPGroupModel>();
                                for (int index = 0; index < entry.Attributes[AttributeNames.Member].Count; index++)
                                {
                                    String memberName = entry.Attributes[AttributeNames.Member][index].ToString();
                                    var child = GetByDistinguishedName(memberName);
                                    if (child != null)
                                    {
                                        if (child.SID != null)
                                        {
                                            // if null it is not a group, but a user
                                            group.ChildGroups.Add(child);
                                        }
                                    }
                                }
                            }
                        }
                        res.Add(group);
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

        public Model.LDAPGroupModel GetByDistinguishedName(string dn)
        {
            Model.LDAPGroupModel res = new Model.LDAPGroupModel();
            try
            {
                var request = new SearchRequest(dn, "(&(objectClass=group))", System.DirectoryServices.Protocols.SearchScope.Subtree, null);
                var pageResultRequestControl = new PageResultRequestControl(25);
                request.Controls.Add(pageResultRequestControl);

                var response = (SearchResponse)_ldapConnection.SendRequest(request);
                int counter = 0;
                foreach (SearchResultEntry entry in response.Entries)
                {
                    counter++;
                    if (counter > 1)
                    {
                        throw new Exception("Found multiple groups with the same dn");
                    }
                    res = GetAttributesFromEntry(entry);
                    return res;
                }
            }
            catch (Exception exc)
            {
                // ignore these items for now
                return null;
            }
            return res;
        }

        public List<LDAPGroupModel> Search(string query)
        {
            List<Model.LDAPGroupModel> res = new List<Model.LDAPGroupModel>();
            if (query.ToUpper().Trim().IndexOf("CN=") >= 0)
            {
                query = query.Substring(3);
            }

            string baseQuery =
                        @"(&" +
                            "(objectClass=group)" +
                            "(|" +
                                "(&" +
                                    "(cn={0}*)" +
                                ")" +
                            ")" +
                        ")";
            string filter = string.Format(baseQuery, query);

            var request = new SearchRequest(_ldapConnectionInfo.BaseDirectory, filter, System.DirectoryServices.Protocols.SearchScope.Subtree, null);
            var pageResultRequestControl = new PageResultRequestControl(25);
            request.Controls.Add(pageResultRequestControl);

            var response = (SearchResponse)_ldapConnection.SendRequest(request);
            foreach (SearchResultEntry entry in response.Entries)
            {
                Model.LDAPGroupModel group = new Model.LDAPGroupModel();
                group.ID = entry.DistinguishedName;
                group.Name = entry.Attributes[AttributeNames.Name][0].ToString();
                res.Add(group);
            }
            return res;
        }

        public LDAPGroupModel GetAttributesFromEntry(SearchResultEntry entry)
        {
            Model.LDAPGroupModel group = new Model.LDAPGroupModel();
            group.ID = entry.DistinguishedName;
            group.Name = entry.Attributes[AttributeNames.Name][0].ToString();
            group.Email = entry.Attributes["mail"] != null ? entry.Attributes["mail"][0].ToString() : "";
            group.msExchRecipientTypeDetails = entry.Attributes[AttributeNames.msExchRecipientTypeDetails] != null ? entry.Attributes[AttributeNames.msExchRecipientTypeDetails][0].ToString() : "";
            group.msDSPrincipalName = entry.Attributes[AttributeNames.msDSPrincipalName] != null ? entry.Attributes[AttributeNames.msDSPrincipalName][0].ToString() : "";
            group.Domain = getDomainByMsDSPrincipalName(group.msDSPrincipalName);

            try
            {
                var sid = new SecurityIdentifier((byte[])entry.Attributes[AttributeNames.Sid][0], 0);
                group.SID = sid.ToString();
            }
            catch (Exception exc)
            {
                group.SID = "";
            }

            return group;
        }

        private string getDomainByMsDSPrincipalName(string msDSPrincipalName)
        {
            if (msDSPrincipalName.Trim() != "")
            {
                string[] aDomain = msDSPrincipalName.Split('\\');
                if (aDomain.Length > 1)
                {
                    return aDomain[0];
                }
            }
            return "";
        }
    }
}
