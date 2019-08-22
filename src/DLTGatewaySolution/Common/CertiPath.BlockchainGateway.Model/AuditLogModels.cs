using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CertiPath.BlockchainGateway.Model
{
    public enum AuditLogObjectType
    {
        BusinessNetwork,
        BusinessNetworkObject,
        BusinessNetworkNamespace,
        BusinessNetworkObjectProperty,
        BusinessNetworkObjectChart,
        TransactionHistory,
        DataStore,
        LedgerServer,
        User,
        FileUpload,
        Role_UserGroup,
        Role,
        Setting
    }

    public enum AuditLogOperationType
    {
        Create,
        Update,
        Delete,
        Login
    }

    public class AuditLogModel
    {
        public AuditLogOperationType OperationType;
        public AuditLogObjectType PrimaryObjectType;
        public Guid PrimaryObjectGUID;
        public AuditLogObjectType? SecondaryObjectType;
        public Guid? SecondaryObjectGUID;

        public string NewRecordValue;
        public string OldRecordValue;

    }
}
