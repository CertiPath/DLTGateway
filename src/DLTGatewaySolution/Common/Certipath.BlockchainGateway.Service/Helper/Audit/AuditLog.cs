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
        private DataModelContainer _context;

        public AuditLog(DataModelContainer context)
        {
            _context = context;
        }

        internal void Save(AuditLogModel model)
        {
            CertiPath.BlockchainGateway.DataLayer.AuditLog alo = new CertiPath.BlockchainGateway.DataLayer.AuditLog();
            var currentUser = _context.User.Take(1).SingleOrDefault();     // TODO: FIX THIS

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
            alo.UserGUID = currentUser.GUID;
            alo.UserName = String.Format("{0} {1}", currentUser.FirstName, currentUser.LastName);
            alo.TransactionSequence = 0;

            _context.AuditLog.Add(alo);
            _context.SaveChanges();
        }
    }
}
