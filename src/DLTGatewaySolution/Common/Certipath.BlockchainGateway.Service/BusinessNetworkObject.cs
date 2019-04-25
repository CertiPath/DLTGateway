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
        private DataModelContainer _context;
        private Helper.Common.EntityConverter _converter;

        public BusinessNetworkObject(DataModelContainer context)
        {
            _context = context;
            _converter = new Helper.Common.EntityConverter();
        }

        public List<BusinessNetworkObjectViewModel> GetDetailsByNamespace(Guid businessNetworkNamespaceGUID)
        {
            List<BusinessNetworkObjectViewModel> res = new List<BusinessNetworkObjectViewModel>();
            var list = _context.vBusinessNetworkObject
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
            var bno = _context.BusinessNetworkObject.Where(w => w.GUID == obj.BusinessNetworkObjectGUID).SingleOrDefault();
            string originalObject = _converter.GetJson(bno);
            bno.Deleted = true;
            _context.SaveChanges();

            // Audit Log
            Helper.Audit.AuditLog alo = new Helper.Audit.AuditLog(_context);
            AuditLogModel alm = new AuditLogModel();

            alm.OperationType = AuditLogOperationType.Delete;
            alm.PrimaryObjectGUID = bno.GUID;
            alm.PrimaryObjectType = AuditLogObjectType.BusinessNetworkObject;
            alm.SecondaryObjectGUID = bno.BusinessNetworkNamespaceGUID;
            alm.SecondaryObjectType = AuditLogObjectType.BusinessNetworkNamespace;
            alm.NewRecordValue = _converter.GetJson(bno);
            alm.OldRecordValue = originalObject;
            alo.Save(alm);
        }

        public void Save(BusinessNetworkObjectViewModel obj)
        {
            DataLayer.BusinessNetworkObject bno = new DataLayer.BusinessNetworkObject();
            bool lAddNew = true;
            string originalObject = "";
            if (obj.BusinessNetworkObjectGUID != null && obj.BusinessNetworkObjectGUID != Guid.Empty)
            {
                lAddNew = false;
                bno = _context.BusinessNetworkObject.Where(w => w.GUID == obj.BusinessNetworkObjectGUID).SingleOrDefault();
            }
            originalObject = _converter.GetJson(bno);

            bno.Name = obj.BusinessNetworkObjectName;
            bno.ClassName = obj.BusinessNetworkObjectClassName;
            if (lAddNew)
            {
                bno.GUID = Guid.NewGuid();
                bno.BusinessNetworkNamespaceGUID = obj.BusinessNetworkNamespaceGUID;
                _context.BusinessNetworkObject.Add(bno);
            }
            _context.SaveChanges();

            // Audit Log
            Helper.Audit.AuditLog alo = new Helper.Audit.AuditLog(_context);
            AuditLogModel alm = new AuditLogModel();

            alm.OperationType = lAddNew ? AuditLogOperationType.Create : AuditLogOperationType.Update;
            alm.PrimaryObjectGUID = bno.GUID;
            alm.PrimaryObjectType = AuditLogObjectType.BusinessNetworkObject;
            alm.SecondaryObjectGUID = bno.BusinessNetworkNamespaceGUID;
            alm.SecondaryObjectType = AuditLogObjectType.BusinessNetworkNamespace;
            alm.NewRecordValue = _converter.GetJson(bno);
            alm.OldRecordValue = originalObject;
            alo.Save(alm);
        }

        public BusinessNetworkObjectDetailsModel GetDetails(Guid businessNetworkObjectGUID)
        {
            BusinessNetworkObjectDetailsModel res = new BusinessNetworkObjectDetailsModel();
            res.GUID = businessNetworkObjectGUID;
            
            // property list
            res.PropertyList = new List<BusinessNetworkObjectPropertyModel>();
            var properties = _context.BusinessNetworkObjectProperty
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
            DataLayer.BusinessNetworkObjectProperty bnop = new DataLayer.BusinessNetworkObjectProperty();

            bool lAddNew = true;
            string originalObject = "";
            if (obj.GUID != null && obj.GUID != Guid.Empty)
            {
                lAddNew = false;
                bnop = _context.BusinessNetworkObjectProperty.Where(w => w.GUID == obj.GUID).SingleOrDefault();
            }
            originalObject = _converter.GetJson(bnop);

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
                _context.BusinessNetworkObjectProperty.Add(bnop);
            }
            _context.SaveChanges();

            // Audit Log
            Helper.Audit.AuditLog alo = new Helper.Audit.AuditLog(_context);
            AuditLogModel alm = new AuditLogModel();

            alm.OperationType = lAddNew ? AuditLogOperationType.Create : AuditLogOperationType.Update;
            alm.PrimaryObjectGUID = bnop.GUID;
            alm.PrimaryObjectType = AuditLogObjectType.BusinessNetworkObjectProperty;
            alm.SecondaryObjectGUID = bnop.BusinessNetworkObjectGUID;
            alm.SecondaryObjectType = AuditLogObjectType.BusinessNetworkObject;
            alm.NewRecordValue = _converter.GetJson(bnop);
            alm.OldRecordValue = originalObject;
            alo.Save(alm);
        }

        public void DeleteProperty(BusinessNetworkObjectPropertyModel obj)
        {
            var objProp = _context.BusinessNetworkObjectProperty.Where(w => w.GUID == obj.GUID).SingleOrDefault();
            string originalObject = _converter.GetJson(objProp);
            objProp.Deleted = true;
            _context.SaveChanges();

            // Audit Log
            Helper.Audit.AuditLog alo = new Helper.Audit.AuditLog(_context);
            AuditLogModel alm = new AuditLogModel();

            alm.OperationType = AuditLogOperationType.Delete;
            alm.PrimaryObjectGUID = objProp.GUID;
            alm.PrimaryObjectType = AuditLogObjectType.BusinessNetworkObjectProperty;
            alm.SecondaryObjectGUID = objProp.BusinessNetworkObjectGUID;
            alm.SecondaryObjectType = AuditLogObjectType.BusinessNetworkObject;
            alm.NewRecordValue = _converter.GetJson(objProp);
            alm.OldRecordValue = originalObject;
            alo.Save(alm);
        }

        private int getNextSortOrder(Guid objGUID)
        {
            var last = _context.BusinessNetworkObjectProperty
                        .Where(w => w.BusinessNetworkObjectGUID == objGUID)
                        .OrderByDescending(o => o.SortOrder)
                        .Take(1).SingleOrDefault();
            return last == null ? 0 : last.SortOrder + 1;
        }

        public List<BusinessNetworkObjectChartModel> GetCharts(Guid objGUID)
        {
            var configuredCharts = _context.BusinessNetworkObjectChart
                                        .Where(w => w.BusinessNetworkObjectGUID == objGUID)
                                        .Where(w => w.Deleted == false)
                                        .OrderBy(O => O.SortOrder)
                                        .ToList();

            List<BusinessNetworkObjectChartModel> result = new List<BusinessNetworkObjectChartModel>();
            foreach (var chart in configuredCharts)
            {
                result.Add(new BusinessNetworkObjectChartModel()
                {
                    BusinessNetworkObjectGUID = chart.BusinessNetworkObjectGUID,
                    ChartSettings = chart.ChartSettings,
                    Description = chart.Description,
                    Disabled = chart.Disabled,
                    GUID = chart.GUID,
                    Name = chart.Name,
                    SortOrder = chart.SortOrder,
                    ChartTypeGUID = chart.ChartTypeGUID,
                    ChartTypeCode = chart.ChartType.Code,
                    ChartTypeName = chart.ChartType.Name,
                    ChartCategoryGUID = chart.ChartType.ChartCategory.GUID,
                    ChartCategoryCode = chart.ChartType.ChartCategory.Code,
                    ChartCategoryName = chart.ChartType.ChartCategory.Name
                });
            }
            return result;
        }

        public void DisableChart(Guid GUID)
        {
            enableDisableChart(true, GUID);
        }

        public void EnableChart(Guid GUID)
        {
            enableDisableChart(false, GUID);
        }

        private void enableDisableChart(bool disable, Guid GUID)
        {
            var chart = _context.BusinessNetworkObjectChart.Where(w => w.GUID == GUID).SingleOrDefault();
            string originalObject = _converter.GetJson(chart);
            chart.Disabled = disable;
            _context.SaveChanges();

            // Audit Log
            Helper.Audit.AuditLog alo = new Helper.Audit.AuditLog(_context);
            AuditLogModel alm = new AuditLogModel();

            alm.OperationType = AuditLogOperationType.Update;
            alm.PrimaryObjectGUID = chart.GUID;
            alm.PrimaryObjectType = AuditLogObjectType.BusinessNetworkObjectChart;
            alm.SecondaryObjectGUID = chart.BusinessNetworkObjectGUID;
            alm.SecondaryObjectType = AuditLogObjectType.BusinessNetworkObject;
            alm.NewRecordValue = _converter.GetJson(chart);
            alm.OldRecordValue = originalObject;
            alo.Save(alm);
        }

        public void DeleteChart(Guid GUID)
        {
            var chart = _context.BusinessNetworkObjectChart.Where(w => w.GUID == GUID).SingleOrDefault();
            string originalObject = _converter.GetJson(chart);
            chart.Deleted = true;
            _context.SaveChanges();

            // Audit Log
            Helper.Audit.AuditLog alo = new Helper.Audit.AuditLog(_context);
            AuditLogModel alm = new AuditLogModel();

            alm.OperationType = AuditLogOperationType.Delete;
            alm.PrimaryObjectGUID = chart.GUID;
            alm.PrimaryObjectType = AuditLogObjectType.BusinessNetworkObjectChart;
            alm.SecondaryObjectGUID = chart.BusinessNetworkObjectGUID;
            alm.SecondaryObjectType = AuditLogObjectType.BusinessNetworkObject;
            alm.NewRecordValue = _converter.GetJson(chart);
            alm.OldRecordValue = originalObject;
            alo.Save(alm);
        }

        public List<ChartCategoryModel> GetChartCategories()
        {
            var list = _context.ChartCategory.OrderBy(o => o.Name).ToList();
            List<ChartCategoryModel> res = new List<ChartCategoryModel>();
            foreach (var item in list)
            {
                res.Add(new ChartCategoryModel() {
                    Code = item.Code,
                    Description = item.Description,
                    GUID = item.GUID,
                    Name = item.Name
                });
            }
            return res;
        }

        public List<ChartTypeModel> GetChartTypes()
        {
            var list = _context.ChartType.OrderBy(o => o.Name).ToList();
            List<ChartTypeModel> res = new List<ChartTypeModel>();
            foreach (var item in list)
            {
                res.Add(new ChartTypeModel()
                {
                    ChartCategoryGUID = item.ChartCategoryGUID,
                    Code = item.Code,
                    Description = item.Description,
                    GUID = item.GUID,
                    Name = item.Name
                });
            }
            return res;
        }

        public void SaveChart(BusinessNetworkObjectChartModel obj)
        {
            obj.GUID = obj.GUID == null ? Guid.Empty : obj.GUID;
            var chart = _context.BusinessNetworkObjectChart.Where(w => w.GUID == obj.GUID).SingleOrDefault();
            string originalObject = chart == null ? "" : _converter.GetJson(chart);
            bool lAddNew = false;
            if (chart == null)
            {
                lAddNew = true;
                chart = new BusinessNetworkObjectChart();
                chart.GUID = Guid.NewGuid();
                chart.Deleted = false;
                chart.Disabled = false;
                chart.BusinessNetworkObjectGUID = obj.BusinessNetworkObjectGUID;
            }
            chart.Name = obj.Name;
            chart.Description = obj.Description;
            chart.ChartTypeGUID = obj.ChartTypeGUID;
            chart.SortOrder = getNextChartSortOrder(obj.BusinessNetworkObjectGUID);
            chart.ChartSettings = Newtonsoft.Json.JsonConvert.SerializeObject(obj.ChartSettingsObject);

            if (lAddNew)
            {
                _context.BusinessNetworkObjectChart.Add(chart);
            }
            _context.SaveChanges();

            // Audit Log
            Helper.Audit.AuditLog alo = new Helper.Audit.AuditLog(_context);
            AuditLogModel alm = new AuditLogModel();

            alm.OperationType = AuditLogOperationType.Delete;
            alm.PrimaryObjectGUID = chart.GUID;
            alm.PrimaryObjectType = AuditLogObjectType.BusinessNetworkObjectChart;
            alm.SecondaryObjectGUID = chart.BusinessNetworkObjectGUID;
            alm.SecondaryObjectType = AuditLogObjectType.BusinessNetworkObject;
            alm.NewRecordValue = _converter.GetJson(chart);
            alm.OldRecordValue = originalObject;
            alo.Save(alm);
        }

        private int getNextChartSortOrder(Guid objGUID)
        {
            var last = _context.BusinessNetworkObjectChart
                        .Where(w => w.BusinessNetworkObjectGUID == objGUID)
                        .OrderByDescending(o => o.SortOrder)
                        .Take(1).SingleOrDefault();
            return last == null ? 0 : last.SortOrder + 1;
        }
    }
}
