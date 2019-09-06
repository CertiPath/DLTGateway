using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using CertiPath.BlockchainGateway.DataLayer;

namespace CertiPath.BlockchainGateway.API.Controllers
{
    [Authorize]
    public class BaseController : ApiController
    {
        public DataLayer.DataModelContainer DatabaseContext;

        public bool _globalView = false;
        public bool _globalAdmin = false;
        public string _userGroups = "";

        public List<DataLayer.udfUserBusinessNetworkLocalAdmin_Result> _localAdminBizNetworkList;
        public List<DataLayer.udfUserBusinessNetworkLocalView_Result> _localViewBizNetworkList;

        public List<Guid> _allNetworkViewList;
        public List<Guid> _allNetworkAdminList;

        public BaseController()
        {
            try
            {
                DatabaseContext = DataLayer.DataModelContainer.Builder().Build();

                Helper.Claims claims = new Helper.Claims();
                _globalView = claims.isGlobalAdmin() || claims.isGlobalView() || claims.isSuperAdmin();
                _globalAdmin = claims.isSuperAdmin() || claims.isGlobalAdmin();

                _userGroups = claims.GetGroups();

                _localAdminBizNetworkList = DatabaseContext.udfUserBusinessNetworkLocalAdmin(_userGroups).ToList();
                _localViewBizNetworkList = DatabaseContext.udfUserBusinessNetworkLocalView(_userGroups).ToList();

                _allNetworkViewList = getAllViewList(_globalView, _userGroups, _localAdminBizNetworkList, _localViewBizNetworkList);
                _allNetworkAdminList = getAllAdminList(_globalView, _userGroups, _localAdminBizNetworkList, _localViewBizNetworkList);

            }
            catch (Exception exc)
            {
                Log.Error("API Base Controller Exception", exc);
                throw exc;
            }
        }

        private List<Guid> getAllViewList(bool globalView, string userGroups, List<udfUserBusinessNetworkLocalAdmin_Result> localAdminBizNetworkList, List<udfUserBusinessNetworkLocalView_Result> localViewBizNetworkList)
        {
            //Log.Info("Get all view list for user:");
            //Log.Info("  Global view: " + globalView.ToString());
            //Log.Info("  User groups: " + userGroups);
            List<Guid> result = new List<Guid>();
            if (globalView)
            {
                var networks = DatabaseContext.BusinessNetwork.Where(w => w.Deleted == false).ToList();
                foreach (var network in networks)
                {
                    result.Add(network.GUID);
                }
            }
            else
            {
                foreach (var localAdmin in localAdminBizNetworkList)
                {
                    //Log.Info("      Local Admin: " + localAdmin.Name);
                    var temp = result.Where(w => w == localAdmin.GUID).SingleOrDefault();
                    if (temp == null || temp == Guid.Empty)
                    {
                        result.Add(localAdmin.GUID);
                    }
                }
                foreach (var localView in localViewBizNetworkList)
                {
                    //Log.Info("      Local View: " + localView.Name);
                    var temp = result.Where(w => w == localView.GUID).SingleOrDefault();
                    if (temp == null || temp == Guid.Empty)
                    {
                        result.Add(localView.GUID);
                    }
                }
            }
            return result;
        }

        private List<Guid> getAllAdminList(bool globalView, string userGroups, List<udfUserBusinessNetworkLocalAdmin_Result> localAdminBizNetworkList, List<udfUserBusinessNetworkLocalView_Result> localViewBizNetworkList)
        {
            List<Guid> result = new List<Guid>();
            if (globalView)
            {
                var networks = DatabaseContext.BusinessNetwork.Where(w => w.Deleted == false).ToList();
                foreach (var network in networks)
                {
                    result.Add(network.GUID);
                }
            }
            else
            {
                foreach (var localAdmin in localAdminBizNetworkList)
                {
                    var temp = result.Where(w => w == localAdmin.GUID).SingleOrDefault();
                    if (temp == null || temp == Guid.Empty)
                    {
                        result.Add(localAdmin.GUID);
                    }
                }
            }
            return result;
        }

        internal bool CanViewNetwork(Guid? businessNetworkGUID)
        {
            if (_globalAdmin || _globalView)
            {
                return true;
            }
            else
            {
                // is local admin
                var bizNetAdmin = _localAdminBizNetworkList.Where(w => w.GUID == businessNetworkGUID).SingleOrDefault();
                if (bizNetAdmin != null)
                {
                    return true;
                }
                else
                {
                    if (businessNetworkGUID == null || businessNetworkGUID == Guid.Empty)
                    {
                        return false;
                    }
                    var bizNetView = _localViewBizNetworkList.Where(w => w.GUID == businessNetworkGUID).SingleOrDefault();
                    return bizNetView == null ? false : true;
                }
            }
        }

        internal bool CanAdminNetwork(Guid? businessNetworkGUID)
        {
            if (_globalAdmin)
            {
                return true;
            }
            else
            {
                if (businessNetworkGUID == null || businessNetworkGUID == Guid.Empty)
                {
                    return false;
                }
                var bizNet = _localAdminBizNetworkList.Where(w => w.GUID == businessNetworkGUID).SingleOrDefault();
                return bizNet == null ? false : true;
            }
        }
    }
}
