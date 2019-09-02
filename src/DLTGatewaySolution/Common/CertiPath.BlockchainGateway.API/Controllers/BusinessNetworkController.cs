using CertiPath.BlockchainGateway.Model;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Collections.Specialized;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace CertiPath.BlockchainGateway.API.Controllers
{
    public class BusinessNetworkController : BaseController
    {
        bool _canViewAllNetworks = false;
        bool _globalAdmin = false;
        string _userGroups = "";
        List<DataLayer.udfUserBusinessNetworkLocalAdmin_Result> localAdminBizNetworkList;

        public BusinessNetworkController()
        {
            Helper.Claims claims = new Helper.Claims();
            _canViewAllNetworks = claims.isGlobalAdmin() || claims.isGlobalView() || claims.isSuperAdmin();
            _globalAdmin = claims.isSuperAdmin() || claims.isGlobalAdmin();
            _userGroups = claims.GetGroups();

            localAdminBizNetworkList = DatabaseContext.udfUserBusinessNetworkLocalAdmin(_userGroups).ToList();
        }

        public BusinessNetworkTableModel GetAll()
        {
            CertiPath.BlockchainGateway.Service.BusinessNetwork srvBN = new Service.BusinessNetwork(DatabaseContext);
            var list = srvBN.GetAll(_canViewAllNetworks, _userGroups);
            return list;
        }

        public BusinessNetworkModel GetDetails(Guid GUID)
        {
            CertiPath.BlockchainGateway.Service.BusinessNetwork srvBN = new Service.BusinessNetwork(DatabaseContext);
            var res = srvBN.GetDetails(GUID, _canViewAllNetworks, _userGroups);
            return res;
        }

        public BusinessNetworkModel GetMetadata()
        {
            CertiPath.BlockchainGateway.Service.BusinessNetwork srvBN = new Service.BusinessNetwork(DatabaseContext);
            var res = srvBN.GetMetadata();
            return res;
        }

        [HttpPost]
        public ApiResult Save(BusinessNetworkModel obj)
        {
            // only super admin users can add new biz network records
            if (obj.GUID == null || obj.GUID == Guid.Empty)
            {
                Helper.Claims claims = new Helper.Claims();
                bool isSuperAdmin = claims.isSuperAdmin();
                if (isSuperAdmin == false)
                {
                    throw new Exception(Helper.Contstants.PERMISSION_DENIED_SUPER_ADMIN);
                }
            }

            CertiPath.BlockchainGateway.Service.BusinessNetwork bnet = new Service.BusinessNetwork(DatabaseContext);
            var result = bnet.Save(obj);
            return result;
        }

        [HttpPost]
        public void Delete(BusinessNetworkModel obj)
        {
            // TODO: Deal with response object and do error handling
            CertiPath.BlockchainGateway.Service.BusinessNetwork bnet = new Service.BusinessNetwork(DatabaseContext);
            bnet.Delete(obj);
        }

        [HttpPost]
        public void Enable(BusinessNetworkModel obj)
        {
            // TODO: Deal with response object and do error handling
            CertiPath.BlockchainGateway.Service.BusinessNetwork bnet = new Service.BusinessNetwork(DatabaseContext);
            bnet.Enable(obj);
        }

        [HttpPost]
        public void Disable(BusinessNetworkModel obj)
        {
            // TODO: Deal with response object and do error handling
            CertiPath.BlockchainGateway.Service.BusinessNetwork bnet = new Service.BusinessNetwork(DatabaseContext);
            bnet.Disable(obj);
        }

        [HttpPost]
        public void DeleteConnectionFile(FileUploadModel file)
        {
            // TODO: Deal with response object and do error handling
            CertiPath.BlockchainGateway.Service.BusinessNetwork bnet = new Service.BusinessNetwork(DatabaseContext);
            bnet.DeleteConnectionFile(file.GUID);
        }
        
        [HttpPost]
        public void SaveConnectionFile()
        {
            // TODO: Deal with response object and do error handling
            if (HttpContext.Current.Request.Files.AllKeys.Any())
            {
                // Get the uploaded image from the Files collection
                var httpPostedFile = HttpContext.Current.Request.Files["file"];
                var givenName = HttpContext.Current.Request.Params["name"];
                Guid bneGUID = new Guid(HttpContext.Current.Request.Params["BusinessNetworkGUID"]);

                if (httpPostedFile != null)
                {
                    CertiPath.BlockchainGateway.Service.BusinessNetwork bnet = new Service.BusinessNetwork(DatabaseContext);
                    BinaryReader br = new BinaryReader(httpPostedFile.InputStream);
                    byte[] fileData = br.ReadBytes(httpPostedFile.ContentLength);

                    FileUploadModel model = new FileUploadModel()
                    {
                        FileContent = fileData,
                        FileName = httpPostedFile.FileName,
                        Name = givenName,
                        TypeExtension = httpPostedFile.ContentType,
                        Length = httpPostedFile.ContentLength
                    };
                    bnet.AddConnectionFile(bneGUID, model);
                }
            }
        }
        
    }
    
}
