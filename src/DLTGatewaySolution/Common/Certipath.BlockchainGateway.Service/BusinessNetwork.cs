using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using CertiPath.BlockchainGateway.Model;
using CertiPath.BlockchainGateway.DataLayer;
using Newtonsoft.Json.Linq;

namespace CertiPath.BlockchainGateway.Service
{
    public class BusinessNetwork
    {
        private DataModelContainer _context;

        public BusinessNetwork(DataModelContainer context)
        {
            _context = context;
        }

        public BusinessNetworkTableModel GetAll()
        {
            List<BusinessNetworkModel> list = new List<BusinessNetworkModel>();
            var networks = _context.BusinessNetwork.Where(w => w.Deleted == false).ToList();
            foreach (var network in networks)
            {
                list.Add(new BusinessNetworkModel() {
                    GUID = network.GUID,
                    Name = network.Name,
                    ChannelName = network.ChannelName,
                    PeerAddress = network.PeerAddress,
                    BlockchainFrameworkGUID = network.BlockchainFrameworkGUID,
                    BlockchainFrameworkName = network.BlockchainFramework.DisplayName,
                    Disabled = network.Disabled
                });
            }
            return new BusinessNetworkTableModel() {
                List = list,
                TotalCount = list.Count
            };
        }

        // TODO: Refactor - too much repetition
        public void Delete(BusinessNetworkModel obj)
        {
            Helper.Common.EntityConverter converter = new Helper.Common.EntityConverter();
            var network = _context.BusinessNetwork.Where(w => w.GUID == obj.GUID).SingleOrDefault();
            string originalObject = converter.GetJson(network);
            network.Deleted = true;
            _context.SaveChanges();

            // Audit Log
            Helper.Audit.AuditLog alo = new Helper.Audit.AuditLog(_context);
            AuditLogModel alm = new AuditLogModel();

            alm.OperationType = AuditLogOperationType.Delete;
            alm.PrimaryObjectGUID = network.GUID;
            alm.PrimaryObjectType = AuditLogObjectType.BusinessNetwork;
            alm.SecondaryObjectGUID = null;
            alm.SecondaryObjectType = null;
            alm.NewRecordValue = converter.GetJson(network);
            alm.OldRecordValue = originalObject;
            alo.Save(alm);
        }

        // TODO: Refactor - too much repetition
        public void Disable(BusinessNetworkModel obj)
        {
            Helper.Common.EntityConverter converter = new Helper.Common.EntityConverter();
            var network = _context.BusinessNetwork.Where(w => w.GUID == obj.GUID).SingleOrDefault();
            string originalObject = converter.GetJson(network);
            network.Disabled = true;
            _context.SaveChanges();

            // Audit Log
            Helper.Audit.AuditLog alo = new Helper.Audit.AuditLog(_context);
            AuditLogModel alm = new AuditLogModel();

            alm.OperationType = AuditLogOperationType.Update;
            alm.PrimaryObjectGUID = network.GUID;
            alm.PrimaryObjectType = AuditLogObjectType.BusinessNetwork;
            alm.SecondaryObjectGUID = null;
            alm.SecondaryObjectType = null;
            alm.NewRecordValue = converter.GetJson(network);
            alm.OldRecordValue = originalObject;
            alo.Save(alm);
        }

        public void DeleteConnectionFile(Guid fileGUID)
        {
            Helper.Common.EntityConverter converter = new Helper.Common.EntityConverter();
            var bnfu = _context.BusinessNetwork_FileUpload
                                    .Where(w => w.Deleted == false)
                                    .Where(w => w.FileUploadGUID == fileGUID)
                                    .SingleOrDefault();
            bnfu.Deleted = true;

            var file = _context.FileUpload.Where(w => w.GUID == fileGUID).SingleOrDefault();
            string originalObject = converter.GetJson(file);
            file.Deleted = true;
            _context.SaveChanges();

            // Audit Log
            Helper.Audit.AuditLog alo = new Helper.Audit.AuditLog(_context);
            AuditLogModel alm = new AuditLogModel();

            alm.OperationType = AuditLogOperationType.Delete;
            alm.PrimaryObjectGUID = file.GUID;
            alm.PrimaryObjectType = AuditLogObjectType.FileUpload;
            alm.SecondaryObjectGUID = bnfu.BusinessNetworkGUID;
            alm.SecondaryObjectType = AuditLogObjectType.BusinessNetwork;
            alm.NewRecordValue = converter.GetJson(file);
            alm.OldRecordValue = originalObject;
            alo.Save(alm);
        }

        // TODO: Refactor - too much repetition
        public void Enable(BusinessNetworkModel obj)
        {
            Helper.Common.EntityConverter converter = new Helper.Common.EntityConverter();
            var network = _context.BusinessNetwork.Where(w => w.GUID == obj.GUID).SingleOrDefault();
            string originalObject = converter.GetJson(network);
            network.Disabled = false;
            _context.SaveChanges();

            // Audit Log
            Helper.Audit.AuditLog alo = new Helper.Audit.AuditLog(_context);
            AuditLogModel alm = new AuditLogModel();

            alm.OperationType = AuditLogOperationType.Update;
            alm.PrimaryObjectGUID = network.GUID;
            alm.PrimaryObjectType = AuditLogObjectType.BusinessNetwork;
            alm.SecondaryObjectGUID = null;
            alm.SecondaryObjectType = null;
            alm.NewRecordValue = converter.GetJson(network);
            alm.OldRecordValue = originalObject;
            alo.Save(alm);
        }

        public void AddConnectionFile(Guid bneGUID, FileUploadModel model)
        {
            Helper.Common.EntityConverter converter = new Helper.Common.EntityConverter();
            
            DataLayer.FileUpload fup = new FileUpload()
            {
                GUID = Guid.NewGuid(),
                Deleted = false,
                FileContent = model.FileContent,
                FileName = model.FileName,
                Name = model.Name,
                TypeExtension = model.TypeExtension
            };
            _context.FileUpload.Add(fup);

            // add link to business network
            string originalObject = "";
            DataLayer.BusinessNetwork_FileUpload bnfu = new BusinessNetwork_FileUpload()
            {
                GUID = Guid.NewGuid(),
                BusinessNetworkGUID = bneGUID,
                FileUploadGUID = fup.GUID,
                Deleted = false
            };
            _context.BusinessNetwork_FileUpload.Add(bnfu);
            _context.SaveChanges();

            // Audit Log
            Helper.Audit.AuditLog alo = new Helper.Audit.AuditLog(_context);
            AuditLogModel alm = new AuditLogModel();

            alm.OperationType = AuditLogOperationType.Create;
            alm.PrimaryObjectGUID = fup.GUID;
            alm.PrimaryObjectType = AuditLogObjectType.FileUpload;
            alm.SecondaryObjectGUID = bneGUID;
            alm.SecondaryObjectType = AuditLogObjectType.BusinessNetwork;
            alm.NewRecordValue = converter.GetJson(fup);
            alm.OldRecordValue = originalObject;
            alo.Save(alm);

            //result.IsSuccess = true;
            //result.Key = network.GUID;
            //return result;
        }

        public ApiResult Save(BusinessNetworkModel obj)
        {
            ApiResult result = new ApiResult();
            Helper.Common.EntityConverter converter = new Helper.Common.EntityConverter();
            
            DataLayer.BusinessNetwork network = new DataLayer.BusinessNetwork();
            bool lAddNew = true;
            string originalObject = "";
            if (obj.GUID != null && obj.GUID != Guid.Empty)
            {
                lAddNew = false;
                network = _context.BusinessNetwork.Where(w => w.GUID == obj.GUID).SingleOrDefault();
            }
            originalObject = converter.GetJson(network);

            network.Name = obj.Name;
            network.BlockchainFrameworkGUID = obj.BlockchainFrameworkGUID;
            network.ChannelName = obj.ChannelName == null ? "" : obj.ChannelName;
            network.PeerAddress = obj.PeerAddress == null ? "" : obj.PeerAddress;
            network.Username = obj.Username == null ? "" : obj.Username;
            network.Endpoint = obj.Endpoint == null ? "" : obj.Endpoint; 

            if (lAddNew)
            {
                network.GUID = Guid.NewGuid();
                network.Deleted = false;
                network.CryptoMaterialDirectory = "";
                _context.BusinessNetwork.Add(network);
            }
            _context.SaveChanges();

            // Audit Log
            Helper.Audit.AuditLog alo = new Helper.Audit.AuditLog(_context);
            AuditLogModel alm = new AuditLogModel();

            alm.OperationType = lAddNew ? AuditLogOperationType.Create : AuditLogOperationType.Update;
            alm.PrimaryObjectGUID = network.GUID;
            alm.PrimaryObjectType = AuditLogObjectType.BusinessNetwork;
            alm.SecondaryObjectGUID = null;
            alm.SecondaryObjectType = null;
            alm.NewRecordValue = converter.GetJson(network);
            alm.OldRecordValue = originalObject;
            alo.Save(alm);

            result.IsSuccess = true;
            result.Key = network.GUID;
            return result;
        }

        public void BusinessNetworkObject_Delete(Guid GUID)
        {
            // 1. delete
            Helper.Common.EntityConverter converter = new Helper.Common.EntityConverter();
            var obj = _context.BusinessNetworkObject.Where(w => w.GUID == GUID).SingleOrDefault();
            string oldObject = converter.GetJson(obj);

            obj.Deleted = true;
            _context.SaveChanges();

            // 2. Audit log
            Helper.Audit.AuditLog alo = new Helper.Audit.AuditLog(_context);
            AuditLogModel alm = new AuditLogModel();

            alm.OperationType = AuditLogOperationType.Delete;
            alm.PrimaryObjectGUID = obj.GUID;
            alm.PrimaryObjectType = AuditLogObjectType.BusinessNetworkObject;
            alm.SecondaryObjectGUID = obj.BusinessNetworkNamespaceGUID;
            alm.SecondaryObjectType = AuditLogObjectType.BusinessNetworkNamespace;
            alm.NewRecordValue = converter.GetJson(obj);
            alm.OldRecordValue = oldObject;
            alo.Save(alm);
        }

        public Model.BusinessNetworkModel GetDetails(Guid GUID)
        {
            Model.BusinessNetworkModel res = new BusinessNetworkModel();

            var bne = _context.BusinessNetwork.Where(w => w.GUID == GUID).SingleOrDefault();
            res.GUID = bne.GUID;
            res.Name = bne.Name;
            res.ChannelName = bne.ChannelName == null ? "" : bne.ChannelName;
            res.PeerAddress = bne.PeerAddress == null ? "" : bne.PeerAddress;
            res.BlockchainFrameworkName = bne.BlockchainFramework.Name;
            res.BlockchainFrameworkGUID = bne.BlockchainFrameworkGUID;
            res.Disabled = bne.Disabled;
            res.Username = bne.Username == null ? "" : bne.Username;
            res.Endpoint = bne.Endpoint == null ? "" : bne.Endpoint;

            // get frameworks
            List<SelectModel> frameworkList = new List<SelectModel>();
            var frameworks = _context.BlockchainFramework.Where(w => w.Deleted == false).ToList();
            foreach (var framework in frameworks)
            {
                frameworkList.Add(new SelectModel()
                {
                    label = framework.DisplayName,
                    value = framework.GUID.ToString()
                });
            }
            res.BlockchainFrameworkList = frameworkList;

            // get all uploaded files
            Helper.BusinessNetwork.FileUpload file = new Helper.BusinessNetwork.FileUpload();
            res.FileUploadList = file.GetAllByBusinessNetwork(res.GUID, false);

            return res;
        }

        public BusinessNetworkModel GetMetadata()
        {
            Model.BusinessNetworkModel res = new BusinessNetworkModel()
            {
                Name = "",
                ChannelName = "",
                PeerAddress = "",
                BlockchainFrameworkName = "",
                Username = "",
                Endpoint = ""
            };

            // get frameworks
            List<SelectModel> frameworkList = new List<SelectModel>();
            var frameworks = _context.BlockchainFramework.Where(w => w.Deleted == false).ToList();
            foreach (var framework in frameworks)
            {
                frameworkList.Add(new SelectModel()
                {
                    label = framework.DisplayName,
                    value = framework.GUID.ToString()
                });
            }
            res.BlockchainFrameworkList = frameworkList;

            return res;
        }

        public List<BusinessNetworkNamespaceModel> GetNamespaces()
        {
            List<BusinessNetworkNamespaceModel> list = new List<BusinessNetworkNamespaceModel>();
            
            var namespaces = _context.BusinessNetworkNamespace.Where(w => w.BusinessNetwork.Deleted == false).ToList();
            foreach (var ns in namespaces)
            {
                var item = new BusinessNetworkNamespaceModel()
                {
                    NamespaceGUID = ns.GUID,
                    NamespaceName = ns.Name,
                    NetworkGUID = ns.BusinessNetwork.GUID,
                    NetworkName = ns.BusinessNetwork.Name,
                    SingleObjectNamespace = ns.SingleObjectNamespace,
                    ObjectList = new List<BusinessNetworkObjectModel>()
                };

                var objects = _context.BusinessNetworkObject.Where(w => w.BusinessNetworkNamespaceGUID == ns.GUID).ToList();
                foreach (var obj in objects)
                {
                    item.ObjectList.Add(new BusinessNetworkObjectModel()
                    {
                        BusinessNetworkNamespaceGUID = obj.BusinessNetworkNamespaceGUID,
                        ClassName = obj.ClassName,
                        GUID = obj.GUID,
                        Name = obj.Name
                    });
                }
                list.Add(item);
            }
            return list;
        }

        public void ProcessNamespace(BusinessNetworkNamespaceModel model)
        {
            // 1. loop through all the objects within a namespace
            // 2. get all the unprocessed transactions within that namespace
            // TODO: we need a better way to query the data. Right now TransactionHistory has only businessnetwork FK, 
            // but instead we should have namespace FK. To reconsider
            // TODO: assumes hyperledger fabric stuff at the moment
            // TODO: I am processing in the order that we received them, but that may not be the right order

            Log.Info("ProcessNamespace: " + model.NamespaceName + " - START");

            var transactionList = _context.TransactionHistory
                                                .Where(w => w.BusinessNetworkGUID == model.NetworkGUID)
                                                .Where(w => w.IsProcessed == false)
                                                .Where(w => w.ChaincodeName == model.NamespaceName)
                                                .OrderBy(o => o.CreatedOn)
                                                .ToList();

            Log.Info("ProcessingNamespace - Found " + transactionList.Count.ToString() + " total transactions to process...");
            foreach (var transaction in transactionList)
            {
                bool lSuccessfullyProcessed = true;
                string processingMessage = "";
                try
                {
                    dynamic stuff = JObject.Parse(transaction.Data);

                    dynamic ns_rwset = stuff.data.data[0].payload.data.actions[0].payload.action.proposal_response_payload.extension.results.ns_rwset;
                    Helper.BusinessNetwork.DataStore DataStore = new Helper.BusinessNetwork.DataStore();
                    foreach (var rws in ns_rwset)
                    {
                        if (rws.rwset.writes != null)
                        {
                            foreach (var write in rws.rwset.writes)
                            {
                                string key = write.key;

                                // check if key is one the objects that we want to track
                                if (model.ObjectList != null && model.ObjectList.Count > 0)
                                {
                                    foreach (var objToTrack in model.ObjectList)
                                    {
                                        if ((model.SingleObjectNamespace) || key.ToUpper().Contains(objToTrack.ClassName.ToUpper()))
                                        {
                                            string keyUpper = key.ToUpper();
                                            string id = "";
                                            if (model.SingleObjectNamespace)
                                            {
                                                id = key;
                                            }
                                            else
                                            {
                                                id = keyUpper.Substring(keyUpper.IndexOf(objToTrack.ClassName.ToUpper()) + objToTrack.ClassName.Length);
                                                id = id.Replace("\0", "");
                                            }

                                            Log.Info("Found an object that is being tracked: " + objToTrack.ClassName + " with id: " + id);
                                            DataStore.Save(objToTrack, id, write, transaction);
                                            processingMessage += String.Format("Successfully processed: {0} with ID {1}", objToTrack.ClassName, id) + Environment.NewLine;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    processingMessage = processingMessage == "" ? "No objects being tracked." : processingMessage;
                }
                catch (Exception exc)
                {
                    lSuccessfullyProcessed = false;
                    processingMessage += "ERROR: " + exc.Message.ToString();
                    if (exc.InnerException != null)
                    {
                        processingMessage += Environment.NewLine + exc.InnerException.ToString();
                    }
                    if (exc.StackTrace != null)
                    {
                        processingMessage += Environment.NewLine + exc.StackTrace.ToString();
                    }
                    Log.Error("Error processing transaction " + transaction.GUID.ToString(), exc);
                }
                finally
                {
                    var tran = _context.TransactionHistory.Where(w => w.GUID == transaction.GUID).SingleOrDefault();
                    tran.IsProcessed = true;
                    tran.ProcessedOn = DateTime.UtcNow;
                    tran.ProcessedNote = processingMessage;
                    _context.SaveChanges();
                }
            }
            Log.Info("ProcessNamespace: " + model.NamespaceName + " - END");
        }
    }
}
