import { Button, Dropdown, Menu, Table } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { deleteRolePermission } from "./roleApis";

const CustomTable = ({ role }) => {
  const [keys, setKeys] = useState([]);
  const [columnItems, setColumnItems] = useState([]);
  const [columnsToShow, setColumnsToShow] = useState([]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Nom",
      dataIndex: "permission",
      key: "permission",
      render: ({ name } = {}) => name,
      sorter: (a, b) => a.permission.name.localeCompare(b.permission.name),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Créé le",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => moment(createdAt).format("DD/MM/YY HH:mm"),
      sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Mis à jour le",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (updatedAt) => moment(updatedAt).format("DD/MM/YYYY HH:mm"),
      sorter: (a, b) => moment(a.updatedAt).unix() - moment(b.updatedAt).unix(),
      sortDirections: ["ascend", "descend"],
    },
  ];

  useEffect(() => {
    setColumnItems(menuItems);
    setColumnsToShow(columns);
  }, []);

  const colVisibilityClickHandler = (col) => {
    const ifColFound = columnsToShow.find((item) => item.key === col.key);
    if (ifColFound) {
      const filteredColumnsToShow = columnsToShow.filter(
        (item) => item.key !== col.key
      );
      setColumnsToShow(filteredColumnsToShow);
    } else {
      const foundIndex = columns.findIndex((item) => item.key === col.key);
      const foundCol = columns.find((item) => item.key === col.key);
      let updatedColumnsToShow = [...columnsToShow];
      updatedColumnsToShow.splice(foundIndex, 0, foundCol);
      setColumnsToShow(updatedColumnsToShow);
    }
  };

  const menuItems = columns.map((item) => {
    return {
      key: item.key,
      label: <span>{item.title}</span>,
    };
  });

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setKeys(selectedRowKeys);
    },
  };
  const [loader, setLoader] = useState(false);

  const onDelete = async () => {
    setLoader(true);
    try {
      const data = await deleteRolePermission(keys);
      if (data.message === "success") {
        window.location.reload();
        setLoader(false);
      }
    } catch (error) {
      setLoader(false);
      console.log(error.message);
    }
  };

  return (
    <div className="card-body mb-3 ">
      <div class="table-responsive">
        <h4 className="text-center mb-2"> Autorisations</h4>

        {keys && keys.length > 0 && (
          <div className="text-start mb-1">
            <Button type="danger" onClick={onDelete} loading={loader}>
              Supprimer
            </Button>
          </div>
        )}
        {columns.length > 0 && (
          <div style={{ marginBottom: "30px" }}>
            <Dropdown
              overlay={
                <Menu onClick={colVisibilityClickHandler} items={columnItems} />
              }
              placement="bottomLeft"
            >
              <Button className="column-visibility">Column Visibility</Button>
            </Dropdown>
          </div>
        )}
        <Table
          rowSelection={columnsToShow.length > 0 && rowSelection}
          columns={columnsToShow}
          dataSource={role}
          rowKey={(record) => record.id}
        />
        {/* <table class='table '>
					<thead className='thead-dark'>
						<tr>
							<th scope='col'>#ID</th>
							<th scope='col'>Permission Name</th>
							<th scope='col'>Created AT</th>
							<th scope='col'>Updated AT</th>
						</tr>
					</thead>
					<tbody>
						{role &&
							role.map((i) => (
								<tr>
									<th scope='row'>{i.id}</th>
									<td>{i.permission.name}</td>
									<td>{moment(i.createdAt).format("DD/MM/YY HH:mm")}</td>
									<td>{moment(i.updatedAt).format("DD/MM/YY HH:mm")}</td>
								</tr>
							))}
					</tbody>
				</table> */}
      </div>
    </div>
  );
};

export default CustomTable;
