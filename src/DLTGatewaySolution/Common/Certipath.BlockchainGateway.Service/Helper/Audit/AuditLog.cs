using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CertiPath.BlockchainGateway.Model;
using CertiPath.BlockchainGateway.DataLayer;

namespace CertiPath.BlockchainGateway.Service.Helper.Audit
{
    public class AuditLog
    {
        internal void Save(AuditLogModel model)
        {
            DataModelContainer context = DataModelContainer.Builder().Build();
            CertiPath.BlockchainGateway.DataLayer.AuditLog alo = new CertiPath.BlockchainGateway.DataLayer.AuditLog();

            alo.GUID = Guid.NewGuid();
            alo.OperationType = model.OperationType.ToString();
            alo.PrimaryObjectGUID = model.PrimaryObjectGUID;
            alo.PrimaryObjectName = model.PrimaryObjectType.ToString();
            alo.SecondaryObjectGUID = model.SecondaryObjectGUID;
            alo.SecondaryObjectName = model.SecondaryObjectType == null ? "" : model.SecondaryObjectType.ToString();

            alo.NewRecordValue = model.NewRecordValue;
            alo.OldRecordValue = model.OldRecordValue;

            alo.ServerName = System.Environment.MachineName;
            alo.ServerUTC = DateTime.UtcNow;
            alo.UserGUID = new Guid("4E8E2AD7-B4D9-4EF5-AC01-6B75B99ADBD0");        // TODO: FIX THIS
            alo.UserName = "TODO";
            alo.TransactionSequence = 0;

            context.AuditLog.Add(alo);
            context.SaveChanges();
        }
    }
}
