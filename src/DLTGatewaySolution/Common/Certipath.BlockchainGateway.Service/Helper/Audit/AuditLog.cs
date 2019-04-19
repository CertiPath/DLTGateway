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
            alo.UserGUID = new Guid("6B49F34B-204E-40AB-8C89-25FE657433EC");        // TODO: FIX THIS
            alo.UserName = "Manoj Srivastava";
            alo.TransactionSequence = 0;

            context.AuditLog.Add(alo);
            context.SaveChanges();
        }
    }
}
