import {
  DataGrid,
  GridColDef,
  GridToolbar,
} from "@mui/x-data-grid";
import "./dataTable.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type Props = {
  columns: GridColDef[];
  rows: object[];
  slug: string;
};

const DataTable = (props: Props) => {

  // TEST THE API
  const sessionUsername = localStorage.getItem('sessionUsername')
  const queryClient = useQueryClient();
   const mutation = useMutation({
          mutationFn: (id: number) => {
          return fetch(`http://31.129.106.235:5052/delete`, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id,sessionUsername }),
            });
            },
           onSuccess: ()=>{
           queryClient.invalidateQueries([`all${props.slug}`]);
           }
           });
    



  const handleDelete = (id: number) => {
    mutation.mutate(id)
  };
  const handleDownload = async (id: number) => {
    try {
      const response = await fetch(`http://31.129.106.235:5052/download`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id,sessionUsername }),
      });
  
      if (response.ok) {
        // Получите имя файла из заголовка Content-Disposition
        const contentDisposition = response.headers.get('Content-Disposition');
        const filename = contentDisposition
          ? contentDisposition.split('filename=')[1]
          : 'downloaded_file';
  
        // Создайте временную ссылку для скачивания файла
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        console.error("Ошибка при скачивании файла");
      }
    } catch (error) {
      console.error("Ошибка при выполнении запроса:", error);
    }
  };
  

  const handleReserve = async (id: number) => {
    try {
      

      const response = await fetch(`http://31.129.106.235:5052/reserve`, {
        method: "POST",
        
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id,sessionUsername }),
      });
      if (response.ok) {
        console.log("Успешный запрос на бронирование");
        alert("Успешно забронировано!");
        queryClient.invalidateQueries([`all${props.slug}`]);
      } else {
        console.error("Ошибка при скачивании файла");
         console.error("Ошибка запроса на бронирование");
        alert("Ошибка при бронировании!");
      }
    } catch (error) {
      console.error("Ошибка при выполнении запроса:", error);
    }
  };
  

  const actionColumn: GridColDef = {
    field: "action",
    headerName: "Action",
    width: 200,
    renderCell: (params) => {
      return (
        <div className="action" >
    
            <div className="delete" onClick={() => handleDownload(params.row.id)}>
            <img src="/dw.png" alt="" />
          </div>

          <div className="delete" onClick={() => handleDelete(params.row.id)}>
            <img src="/delete.svg" alt="" />
          </div>
          <div className="delete" onClick={() => handleReserve(params.row.id)}>
            <img src="/view.svg" alt="" />
          </div>
        </div>
      );
    },
  };

  return (
    <div className="dataTable">
      <DataGrid
        className="dataGrid"
        rows={props.rows}
        columns={[...props.columns, actionColumn]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
        disableColumnFilter
        disableDensitySelector
        disableColumnSelector
      />
    </div>
  );
};

export default DataTable;
