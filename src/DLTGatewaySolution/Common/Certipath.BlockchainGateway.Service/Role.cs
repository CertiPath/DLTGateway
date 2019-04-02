using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CertiPath.BlockchainGateway.Model;
using CertiPath.BlockchainGateway.DataLayer;
using System.Linq.Dynamic;

namespace CertiPath.BlockchainGateway.Service
{
    public class Role
    {
        public RoleTableModel GetAll(TableModel model)
        {
            List<RoleViewModel> list = new List<RoleViewModel>();
            DataModelContainer context = DataModelContainer.Builder().Build();

            bool lFilter = model.FilterList.Count > 0;
            bool lFilterOnName = false;
            string name = "";

            if (lFilter)
            {
                foreach (var filter in model.FilterList)
                {
                    if (filter.id == "Name")
                    {
                        lFilterOnName = true;
                        name = filter.value;
                    }
                }
            }

            string sortBy = "Name ASC";
            if (model.SortList.Count > 0)
            {
                sortBy = model.SortList[0].id + " " + (Convert.ToBoolean(model.SortList[0].desc) ? "DESC" : "ASC");
            }

            var data = context.Role
                            .Where(w => w.Deleted == false)
                            .Where(w =>
                                (lFilter == false) || (lFilterOnName == false || w.Name.Contains(name)))
                            .AsQueryable().OrderBy(sortBy)
                            .Skip(model.PageNumber * model.PageSize)
                            .Take(model.PageSize)
                            .ToList();

            int totalCount = context.Role
                            .Where(w => w.Deleted == false)
                            .Where(w => (lFilter == false) || (lFilterOnName == false || w.Name.Contains(name)))
                            .Count();

            foreach (var item in data)
            {
                list.Add(new RoleViewModel()
                {
                   GUID = item.GUID,
                   Name = item.Name,
                   Description = item.Description,
                   IsSystemRole = item.IsSystemRole
                });
            }
            RoleTableModel result = new RoleTableModel()
            {
                List = list,
                TotalCount = totalCount
            };
            return result;
        }
    }
}
