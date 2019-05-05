using System;
using System.DirectoryServices.Protocols;

namespace CertiPath.BlockchainGateway.LDAP.Helper
{
    public class Connection
    {
        public static LdapConnection Init(Model.LDAPConnectionModel m, bool takeConnectionStringFromConfig)
        {
            LdapConnection ldapConnection = null;

            m.Port = m.Port == 0 ? 389 : m.Port;

            //2777: Find best DC in a multi-site, multi-domain environment
            TokenFactory tk = new TokenFactory(m.Port, takeConnectionStringFromConfig);
            string dc = m.Domain; // tk.GetBestServer();
            LdapDirectoryIdentifier directory = new LdapDirectoryIdentifier(String.IsNullOrEmpty(dc) ? m.Server : dc, m.Port, true, false);

            // Create the LDAP connection object
            ldapConnection = new LdapConnection(directory);
            ldapConnection.Timeout = new TimeSpan(0, 0, 10);

            // LDAP server requires basic authentiction, by default LdapConnection was using NTLM (negotiate)
            // 27JUL2017: Default AuthType to Negotiate
            ldapConnection.Credential = new System.Net.NetworkCredential(m.Username, m.Password);

            // set authentication connection
            m.AuthType = m.AuthType == null ? "" : m.AuthType.ToUpper().Trim();
            switch (m.AuthType)
            {
                case "NTLM":
                    ldapConnection.AuthType = AuthType.Ntlm;
                    break;

                case "KERBEROS":
                    ldapConnection.AuthType = AuthType.Kerberos;
                    break;

                case "MSN":
                    ldapConnection.AuthType = AuthType.Msn;
                    break;

                case "ANONYMOUS":
                    ldapConnection.AuthType = AuthType.Anonymous;
                    break;

                case "NEGOTIATE":
                    ldapConnection.AuthType = AuthType.Negotiate;
                    break;

                case "SICILY":
                    ldapConnection.AuthType = AuthType.Sicily;
                    break;

                case "DIGEST":
                    ldapConnection.AuthType = AuthType.Digest;
                    break;

                case "DPA":
                    ldapConnection.AuthType = AuthType.Dpa;
                    break;

                case "EXTERNAL":
                    ldapConnection.AuthType = AuthType.External;
                    break;

                default:
                    ldapConnection.AuthType = AuthType.Negotiate;
                    break;
            }

            // Set the LDAP protocol version that the LDAP server is expecting
            ldapConnection.SessionOptions.ProtocolVersion = m.ProtocolVersion == 0 ? 3 : m.ProtocolVersion;

            ldapConnection.Bind();
            return ldapConnection;
        }
    }
}