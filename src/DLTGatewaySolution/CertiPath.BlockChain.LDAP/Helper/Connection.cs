using System;
using System.DirectoryServices.Protocols;

namespace CertiPath.BlockChain.LDAP.Helper
{
    public class Connection
    {
        public static LdapConnection Init(BlockchainGateway.Model.LDAPConnectionModel m)
        {
            LdapConnection ldapConnection = null;

            m.Port = m.Port == 0 ? 389 : m.Port;
            LdapDirectoryIdentifier directory = new LdapDirectoryIdentifier(m.Server, m.Port, true, false);

            ldapConnection = new LdapConnection(directory);
            ldapConnection.Timeout = new TimeSpan(0, 0, 10);
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
