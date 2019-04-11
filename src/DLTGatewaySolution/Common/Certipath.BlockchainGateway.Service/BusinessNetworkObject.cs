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

            var list = context.vBusinessNetworkObject
                                    .Where(w => w.BusinessNetworkNamespaceGUID == businessNetworkNamespaceGUID)
                                    .ToList();
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

        public void Delete(BusinessNetworkObjectViewModel obj)
        {
            Helper.Common.EntityConverter converter = new Helper.Common.EntityConverter();
            DataModelContainer context = DataModelContainer.Builder().Build();
            var bno = context.BusinessNetworkObject.Where(w => w.GUID == obj.BusinessNetworkObjectGUID).SingleOrDefault();
            string originalObject = converter.GetJson(bno);
            bno.Deleted = true;
            context.SaveChanges();

            // Audit Log
            Helper.Audit.AuditLog alo = new Helper.Audit.AuditLog();
            AuditLogModel alm = new AuditLogModel();

            alm.OperationType = AuditLogOperationType.Delete;
            alm.PrimaryObjectGUID = bno.GUID;
            alm.PrimaryObjectType = AuditLogObjectType.BusinessNetworkObject;
            alm.SecondaryObjectGUID = bno.BusinessNetworkNamespaceGUID;
            alm.SecondaryObjectType = AuditLogObjectType.BusinessNetworkNamespace;
            alm.NewRecordValue = converter.GetJson(bno);
            alm.OldRecordValue = originalObject;
            alo.Save(alm);
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
        
        public BusinessNetworkObjectDetailsModel GetDetails(Guid businessNetworkObjectGUID)
        {
            DataModelContainer context = DataModelContainer.Builder().Build();
            BusinessNetworkObjectDetailsModel res = new BusinessNetworkObjectDetailsModel();

            res.GUID = businessNetworkObjectGUID;
            
            // property list
            res.PropertyList = new List<BusinessNetworkObjectPropertyModel>();
            var properties = context.BusinessNetworkObjectProperty
                                            .Where(w => w.Deleted == false)
                                            .Where(w => w.BusinessNetworkObjectGUID == businessNetworkObjectGUID)
                                            .OrderBy(o => o.SortOrder)
                                            .ToList();

            foreach (var prop in properties)
            {
                res.PropertyList.Add(new BusinessNetworkObjectPropertyModel()
                {
                    GUID = prop.GUID,
                    IsImported = prop.IsImported,
                    Disabled = prop.Disabled,
                    Visible = prop.Visible,
                    Name = prop.Name,
                    PropertyTypeCode = prop.ObjectPropertyType.Code,
                    PropertyTypeName = prop.ObjectPropertyType.Name
                });
            }
            return res;
        }
        public void SaveProperty(BusinessNetworkObjectPropertyModel obj)
        {
            Helper.Common.EntityConverter converter = new Helper.Common.EntityConverter();
            DataModelContainer context = DataModelContainer.Builder().Build();

            DataLayer.BusinessNetworkObjectProperty bnop = new DataLayer.BusinessNetworkObjectProperty();
            bool lAddNew = true;
            string originalObject = "";
            if (obj.GUID != null && obj.GUID != Guid.Empty)
            {
                lAddNew = false;
                bnop = context.BusinessNetworkObjectProperty.Where(w => w.GUID == obj.GUID).SingleOrDefault();
            }
            originalObject = converter.GetJson(bnop);

            bnop.Name = obj.Name;
            bnop.Disabled = obj.Disabled;
            bnop.Visible = obj.Visible;

            Helper.BusinessNetworkObject.ObjectPropertyType opt = new Helper.BusinessNetworkObject.ObjectPropertyType();
            var propTypeGUID = opt.GetByCode(obj.PropertyTypeCode);
            bnop.ObjectPropertyTypeGUID = propTypeGUID;

            if (lAddNew)
            {
                bnop.GUID = Guid.NewGuid();
                bnop.BusinessNetworkObjectGUID = obj.BusinessNetworkObjectGUID;
                bnop.IsImported = false;
                bnop.BusinessNetworkObjectGUID = obj.BusinessNetworkObjectGUID;
                bnop.SortOrder = getNextSortOrder(obj.BusinessNetworkObjectGUID);
                context.BusinessNetworkObjectProperty.Add(bnop);
            }
            context.SaveChanges();

            // Audit Log
            Helper.Audit.AuditLog alo = new Helper.Audit.AuditLog();
            AuditLogModel alm = new AuditLogModel();

            alm.OperationType = lAddNew ? AuditLogOperationType.Create : AuditLogOperationType.Update;
            alm.PrimaryObjectGUID = bnop.GUID;
            alm.PrimaryObjectType = AuditLogObjectType.BusinessNetworkObjectProperty;
            alm.SecondaryObjectGUID = bnop.BusinessNetworkObjectGUID;
            alm.SecondaryObjectType = AuditLogObjectType.BusinessNetworkObject;
            alm.NewRecordValue = converter.GetJson(bnop);
            alm.OldRecordValue = originalObject;
            alo.Save(alm);
        }

        public void DeleteProperty(BusinessNetworkObjectPropertyModel obj)
        {
            Helper.Common.EntityConverter converter = new Helper.Common.EntityConverter();
            DataModelContainer context = DataModelContainer.Builder().Build();
            var objProp = context.BusinessNetworkObjectProperty.Where(w => w.GUID == obj.GUID).SingleOrDefault();
            string originalObject = converter.GetJson(objProp);
            objProp.Deleted = true;
            context.SaveChanges();

            // Audit Log
            Helper.Audit.AuditLog alo = new Helper.Audit.AuditLog();
            AuditLogModel alm = new AuditLogModel();

            alm.OperationType = AuditLogOperationType.Delete;
            alm.PrimaryObjectGUID = objProp.GUID;
            alm.PrimaryObjectType = AuditLogObjectType.BusinessNetworkObjectProperty;
            alm.SecondaryObjectGUID = objProp.BusinessNetworkObjectGUID;
            alm.SecondaryObjectType = AuditLogObjectType.BusinessNetworkObject;
            alm.NewRecordValue = converter.GetJson(objProp);
            alm.OldRecordValue = originalObject;
            alo.Save(alm);
        }

        private int getNextSortOrder(Guid objGUID)
        {
            DataModelContainer context = DataModelContainer.Builder().Build();
            var last = context.BusinessNetworkObjectProperty
                        .Where(w => w.BusinessNetworkObjectGUID == objGUID)
                        .OrderByDescending(o => o.SortOrder)
                        .Take(1).SingleOrDefault();
            return last == null ? 0 : last.SortOrder + 1;
        }
    }
}
