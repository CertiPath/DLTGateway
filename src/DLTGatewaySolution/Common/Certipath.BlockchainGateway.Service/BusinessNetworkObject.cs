using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CertiPath.BlockchainGateway.DataLayer;
using CertiPath.BlockchainGateway.Model;

namespace CertiPath.BlockchainGateway.Service
{
    public class BusinessNetworkObject
    {
        public List<BusinessNetworkObjectViewModel> GetDetailsByNamespace(Guid businessNetworkNamespaceGUID)
        {
            List<BusinessNetworkObjectViewModel> res = new List<BusinessNetworkObjectViewModel>();
            DataModelContainer context = DataModelContainer.Builder().Build();

            var list = context.vBusinessNetworkObject.Where(w => w.BusinessNetworkNamespaceGUID == businessNetworkNamespaceGUID).ToList();
            foreach (var item in list)
            {
                res.Add(new BusinessNetworkObjectViewModel()
                {
                    BusinessNetworkObjectName = item.BusinessNetworkObjectName,
                    BusinessNetworkObjectClassName = item.BusinessNetworkObjectClassName,
                    ObjectCount = item.ObjectCount,
                    BusinessNetworkObjectGUID = item.BusinessNetworkObjectGUID
                });
            }
            return res;
        }

        public void Save(BusinessNetworkObjectViewModel obj)
        {
            Helper.Common.EntityConverter converter = new Helper.Common.EntityConverter();
            DataModelContainer context = DataModelContainer.Builder().Build();
            
            DataLayer.BusinessNetworkObject bno = new DataLayer.BusinessNetworkObject();
            bool lAddNew = true;
            string originalObject = "";
            if (obj.BusinessNetworkObjectGUID != null && obj.BusinessNetworkObjectGUID != Guid.Empty)
            {
                lAddNew = false;
                bno = context.BusinessNetworkObject.Where(w => w.GUID == obj.BusinessNetworkObjectGUID).SingleOrDefault();
            }
            originalObject = converter.GetJson(bno);

            bno.Name = obj.BusinessNetworkObjectName;
            bno.ClassName = obj.BusinessNetworkObjectClassName;
            if (lAddNew)
            {
                bno.GUID = Guid.NewGuid();
                bno.BusinessNetworkNamespaceGUID = obj.BusinessNetworkNamespaceGUID;
                context.BusinessNetworkObject.Add(bno);
            }
            context.SaveChanges();

            // Audit Log
            Helper.Audit.AuditLog alo = new Helper.Audit.AuditLog();
            AuditLogModel alm = new AuditLogModel();

            alm.OperationType = lAddNew ? AuditLogOperationType.Create : AuditLogOperationType.Update;
            alm.PrimaryObjectGUID = bno.GUID;
            alm.PrimaryObjectType = AuditLogObjectType.BusinessNetworkObject;
            alm.SecondaryObjectGUID = bno.BusinessNetworkNamespaceGUID;
            alm.SecondaryObjectType = AuditLogObjectType.BusinessNetworkNamespace;
            alm.NewRecordValue = converter.GetJson(bno);
            alm.OldRecordValue = originalObject;
            alo.Save(alm);
        }
    }
}
