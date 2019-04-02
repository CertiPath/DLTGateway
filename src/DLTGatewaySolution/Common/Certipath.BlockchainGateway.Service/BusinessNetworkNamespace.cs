using CertiPath.BlockchainGateway.DataLayer;
using CertiPath.BlockchainGateway.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CertiPath.BlockchainGateway.Service
{
    public class BusinessNetworkNamespace
    {
        public List<BusinessNetworkNamespaceViewModel> GetAllByBusinessNetwork(Guid businessNetworkGUID)
        {
            DataModelContainer context = DataModelContainer.Builder().Build();
            var namespaces = context.vBusinessNetworkNamespace.AsNoTracking().Where(w => w.BusinessNetworkGUID == businessNetworkGUID).ToList();
            List<BusinessNetworkNamespaceViewModel> res = new List<BusinessNetworkNamespaceViewModel>();

            foreach (var ns in namespaces)
            {
                res.Add(new BusinessNetworkNamespaceViewModel()
                {
                    Name = ns.BusinessNetworkNamespaceName,
                    GUID = ns.BusinessNetworkNamespaceGUID,
                    ObjectCount = ns.ObjectCount,
                    BusinessNetworkGUID = ns.BusinessNetworkGUID
                });
            }
            return res;
        }

        public BusinessNetworkNamespaceModel GetDetails(Guid namespaceGUID)
        {
            DataModelContainer context = DataModelContainer.Builder().Build();
            var ns = context.BusinessNetworkNamespace.Where(w => w.GUID == namespaceGUID).SingleOrDefault();

            return new BusinessNetworkNamespaceModel()
            {
                NamespaceGUID = ns.GUID,
                NetworkGUID = ns.BusinessNetworkGUID,
                NamespaceName = ns.Name,
                NetworkName = ns.BusinessNetwork.Name
            };
        }

        public void Save(BusinessNetworkNamespaceViewModel obj)
        {
            Helper.Common.EntityConverter converter = new Helper.Common.EntityConverter();
            DataModelContainer context = DataModelContainer.Builder().Build();

            DataLayer.BusinessNetworkNamespace ns = new DataLayer.BusinessNetworkNamespace();
            bool lAddNew = true;
            string originalObject = "";
            if (obj.GUID != null && obj.GUID != Guid.Empty)
            {
                lAddNew = false;
                ns = context.BusinessNetworkNamespace.Where(w => w.GUID == obj.GUID).SingleOrDefault();
            }
            originalObject = converter.GetJson(ns);

            ns.Name = obj.Name;
            if (lAddNew)
            {
                ns.GUID = Guid.NewGuid();
                ns.BusinessNetworkGUID = obj.BusinessNetworkGUID;
                context.BusinessNetworkNamespace.Add(ns);
            }
            context.SaveChanges();

            // Audit Log
            Helper.Audit.AuditLog alo = new Helper.Audit.AuditLog();
            AuditLogModel alm = new AuditLogModel();

            alm.OperationType = lAddNew ? AuditLogOperationType.Create : AuditLogOperationType.Update;
            alm.PrimaryObjectGUID = ns.GUID;
            alm.PrimaryObjectType = AuditLogObjectType.BusinessNetworkNamespace;
            alm.SecondaryObjectGUID = ns.BusinessNetworkGUID;
            alm.SecondaryObjectType = AuditLogObjectType.BusinessNetwork;
            alm.NewRecordValue = converter.GetJson(ns);
            alm.OldRecordValue = originalObject;
            alo.Save(alm);
        }

        public void Delete(Guid GUID)
        {
            Helper.Common.EntityConverter converter = new Helper.Common.EntityConverter();
            DataModelContainer context = DataModelContainer.Builder().Build();
            var ns = context.BusinessNetworkNamespace.Where(w => w.GUID == GUID).SingleOrDefault();
            string originalObject = converter.GetJson(ns);
            ns.Deleted = true;
            context.SaveChanges();

            // Audit Log
            Helper.Audit.AuditLog alo = new Helper.Audit.AuditLog();
            AuditLogModel alm = new AuditLogModel();

            alm.OperationType = AuditLogOperationType.Delete;
            alm.PrimaryObjectGUID = ns.GUID;
            alm.PrimaryObjectType = AuditLogObjectType.BusinessNetworkNamespace;
            alm.SecondaryObjectGUID = ns.BusinessNetworkGUID;
            alm.SecondaryObjectType = AuditLogObjectType.BusinessNetwork;
            alm.NewRecordValue = converter.GetJson(ns);
            alm.OldRecordValue = originalObject;
            alo.Save(alm);
        }
    }
}
