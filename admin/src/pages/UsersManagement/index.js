import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";

import { DataGrid, GridOverlay } from "@material-ui/data-grid";
import { nanoid } from "nanoid";
import { useSelector, useDispatch } from "react-redux";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { useSnackbar } from "notistack";
import ButtonDelete from "./ButtonDelete";
import CachedIcon from "@material-ui/icons/Cached";
import CircularProgress from "@material-ui/core/CircularProgress";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import EditIcon from "@material-ui/icons/Edit";
import slugify from "slugify";

import useStyles from "./styles";
import {
  deleteUser,
  getUsersList,
  resetUserList,
  putUserUpdate,
  postAddUser,
  setStatusIsExistUserModified,
} from "../../reducers/actions/UsersManagement";
import PersonAddIcon from "@material-ui/icons/PersonAdd";

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function CustomLoadingOverlay() {
  return (
    <GridOverlay>
      <CircularProgress style={{ margin: "auto" }} />
    </GridOverlay>
  );
}

export default function UsersManagement() {
  const [editRowsModel, setEditRowsModel] = useState({});
  const classes = useStyles();
  const [usersListDisplay, setUsersListDisplay] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [selectionModel, setSelectionModel] = useState([]);
  const [userListDelete, setUserListDelete] = useState({
    triggerDelete: false,
    userListDelete: [],
    cancel: false,
  });
  const [userListmodified, setUserListmodified] = useState({
    triggerUpdate: false,
    userListmodified: [],
    cancel: false,
  });
  const {
    usersList,
    loadingUsersList,
    errorUsersList,
    successDelete,
    errorDelete,
    loadingDelete,
    successUpdateUser,
    errorUpdateUser,
    loadingAddUser,
    successAddUser,
    errorAddUser,
  } = useSelector((state) => state.usersManagementReducer);
  const dispatch = useDispatch();
  const [btnReFresh, setBtnReFresh] = useState("");
  const [sortBy, setsortBy] = useState({ field: "taiKhoan", sort: "asc" });
  const [valueSearch, setValueSearch] = useState("");
  const clearSetSearch = useRef(0);
  const [addUser, setaddUser] = useState({
    data: [
      {
        id: nanoid(6),
        taiKhoan: "",
        matKhau: "",
        hoTen: "",
        email: "",
        soDt: "",
        maLoaiNguoiDung: false,
      },
    ],
    toggle: false,
    readyAdd: false,
    isFilledIn: false,
  });

  useEffect(() => {
    // get list user l???n ?????u
    if (!usersList) {
      dispatch(getUsersList());
    }
    return () => dispatch(resetUserList());
  }, []);
  useEffect(() => {
    // x??a ho???c update th??nh c??ng th?? refresh list user
    if (successDelete || successUpdateUser || btnReFresh || successAddUser) {
      dispatch(getUsersList());
    }
  }, [successDelete, successUpdateUser, btnReFresh, successAddUser]);
  useEffect(() => {
    if (userListmodified.userListmodified.length || addUser.isFilledIn) {
      dispatch(setStatusIsExistUserModified(true));
    } else {
      dispatch(setStatusIsExistUserModified(false));
    }
  }, [userListmodified.userListmodified, addUser.isFilledIn]);

  useEffect(() => {
    // dispatch(getUsersList()) th??nh c??ng th?? th??m props v??o item ????? hi???n th??? theo y??u c???u DataGrid
    if (usersList?.length) {
      let newUsersListDisplay;
      if (userListmodified.userListmodified.length) {
        // n???u nh???n cancel v?? v???n c??n m???t s??? user ch??a update th?? gi??? l???i data dang ch???nh s???a
        const userListmodifiedRest = userListmodified.userListmodified;
        newUsersListDisplay = usersList.map(function (userNew) {
          let userModified = this.find(
            (user) => user.taiKhoan === userNew.taiKhoan
          );
          if (userModified) {
            userModified = { ...userModified };
            delete userModified.maNhom;
            return {
              ...userModified,
              id: userModified.taiKhoan,
              xoa: "",
              maLoaiNguoiDung:
                userModified.maLoaiNguoiDung === "QuanTri" ? true : false,
              ismodify: true,
            };
          }
          return {
            ...userNew,
            xoa: "",
            id: userNew.taiKhoan,
            maLoaiNguoiDung:
              userNew.maLoaiNguoiDung === "QuanTri" ? true : false,
            ismodify: false,
          };
        }, userListmodifiedRest);
      } else {
        newUsersListDisplay = usersList.map((user, i) => ({
          ...user,
          xoa: "",
          id: user.taiKhoan,
          maLoaiNguoiDung: user.maLoaiNguoiDung === "QuanTri" ? true : false,
          ismodify: false,
        })); // id l?? prop b???t bu???c
      }
      setUsersListDisplay(newUsersListDisplay);
    }
  }, [usersList]);

  useEffect(() => {
    // deleteUser xong th?? th??ng b??o
    if (userListDelete.cancel) {
      return;
    }
    if (successDelete) {
      setUserListDelete((data) => ({ ...data, triggerDelete: nanoid(6) })); // k??ch ho???t x??a ti???p user ti???p theo
      enqueueSnackbar(successDelete, { variant: "success" });
      return;
    }
    if (errorDelete) {
      setUserListDelete((data) => ({ ...data, triggerDelete: nanoid(6) }));
      enqueueSnackbar(errorDelete, { variant: "error" });
    }
  }, [successDelete, errorDelete]);

  useEffect(() => {
    // update user xong th?? th??ng b??o
    if (userListmodified.cancel) {
      return;
    }
    if (successUpdateUser) {
      setUserListmodified((data) => ({ ...data, triggerUpdate: nanoid(6) }));
      enqueueSnackbar("Update th??nh c??ng", { variant: "success" });
      return;
    }
    if (errorUpdateUser) {
      setUserListmodified((data) => ({ ...data, triggerUpdate: nanoid(6) }));
      enqueueSnackbar(errorUpdateUser, { variant: "error" });
    }
  }, [successUpdateUser, errorUpdateUser]);

  useEffect(() => {
    // add user xong th?? th??ng b??o
    if (successAddUser) {
      enqueueSnackbar(
        `???? th??m th??nh c??ng t??i kho???n: ${successAddUser.taiKhoan}`,
        { variant: "success" }
      );
    }
    if (errorAddUser) {
      enqueueSnackbar(errorAddUser, { variant: "error" });
    }
    setaddUser({
      data: [
        {
          id: nanoid(6),
          taiKhoan: "",
          matKhau: "",
          hoTen: "",
          email: "",
          soDt: "",
          maLoaiNguoiDung: false,
        },
      ],
      toggle: false,
      readyAdd: false,
      isFilledIn: false,
    });
  }, [successAddUser, errorAddUser]);

  useEffect(() => {
    // ?? t?????ng l?? ti???n h??nh delete t???ng user trong danh s??ch m???i khi ho??n th??nh call api cho ?????n khi h???t user trong danh d??ch
    if (userListDelete.userListDelete.length) {
      // n???u m???ng c??n ph???n t???
      let newUserListDelete = [...userListDelete.userListDelete]; // copy
      const userDelete = newUserListDelete.shift(); // c???t ra, v?? x??a lu??n ph???n t??? ?????u trong m???ng
      setUserListDelete((data) => ({
        ...data,
        userListDelete: newUserListDelete,
      })); // set array
      setSelectionModel(() => newUserListDelete);
      dispatch(deleteUser(userDelete)); // delete
      return;
    }
    if (userListDelete.userListDelete.length === 0) {
      // n???u m???ng h???t ph???n t???
      setUserListDelete({
        triggerDelete: false,
        userListDelete: [],
        cancel: false,
      });
      dispatch(resetUserList());
      setSelectionModel([]);
    }
  }, [userListDelete.triggerDelete]); // ch??? khi ???????c k??ch ho???t th?? m???i th???c hi???n x??a ti???p user, n???u d??ng chung successDelete, errorDelete l??m trigger c?? th??? l???i do k???t qu??? c???a useEffect tr??n ph??? thu???c v??o successDelete, errorDelete

  useEffect(() => {
    if (userListmodified.userListmodified.length) {
      let newUserListmodified = [...userListmodified.userListmodified];
      const userUpdate = newUserListmodified.shift();
      setUserListmodified((data) => ({
        ...data,
        userListmodified: newUserListmodified,
      }));
      dispatch(putUserUpdate(userUpdate));
      return;
    }
    if (userListmodified.userListmodified.length === 0) {
      setUserListmodified({
        triggerUpdate: false,
        userListmodified: [],
        cancel: false,
      });
      dispatch(resetUserList());
    }
  }, [userListmodified.triggerUpdate]);

  const handleEditCellChange = useCallback(
    ({ id, field, props }) => {
      if (field === "email") {
        const data = props; // Fix eslint value is missing in prop-types for JS files
        const isValid = validateEmail(data.value);
        const newState = {};
        newState[id] = {
          ...editRowsModel[id],
          email: { ...props, error: !isValid },
        };
        setEditRowsModel((state) => ({ ...state, ...newState }));
        if (!validateEmail(props.value)) {
          // n???u email sai th?? tho??t kh??ng l??u
          return;
        }
      }
      if (addUser.toggle) {
        setaddUser((data) => ({
          ...data,
          data: [{ ...data.data[0], [field]: props.value }],
        }));
      }
    },
    [editRowsModel, addUser.toggle]
  );

  // handleEditCellChangeCommitted th???c thi m???i khi cell change ???????c commit(kh??ng l???i validation)
  // so s??nh v???i gi?? tr??? tr?????c khi ch???nh s???a, n???u kh??c bi???t th?? th??m user v??o danh s??ch chu???n b??? update, n???u kh??ng kh??c bi???t th?? x??a kh???i danh s??ch ho???c kh??ng l??m g??
  const handleEditCellChangeCommitted = useCallback(
    ({ id, field, props: { value } }) => {
      if (addUser.toggle) {
        const isFilledIn =
          addUser.data[0].taiKhoan !== "" ||
          addUser.data[0].matKhau !== "" ||
          addUser.data[0].hoTen !== "" ||
          addUser.data[0].email !== "" ||
          addUser.data[0].soDt !== "" ||
          addUser.data[0].maLoaiNguoiDung === true;
        const readyAdd =
          addUser.data[0].taiKhoan !== "" &&
          addUser.data[0].matKhau !== "" &&
          addUser.data[0].hoTen !== "" &&
          addUser.data[0].email !== "" &&
          addUser.data[0].soDt !== "";
        setaddUser((data) => ({ ...data, readyAdd, isFilledIn }));
        return; // kh??ng th???c hi???c c??c vi???c b??n d?????i n???u ??ang ??? m??n h??nh addUser
      }
      const userOriginal = usersList.find((user) => user.taiKhoan === id); // l???y ra ph???n t??? ch??a ???????c ch???nh s???a
      const valueDisplay = value;
      let valueModified = value;
      if (field === "maLoaiNguoiDung") {
        valueModified = value ? "QuanTri" : "KhachHang";
      }
      const isChange = userOriginal[field] === valueModified ? false : true; // li???u c?? thay ?????i
      const indexUserExist = userListmodified.userListmodified.findIndex(
        (user) => user.taiKhoan === id
      ); // user v???a ch???nh c?? ???????c l??u tr?????c ?????
      if (isChange) {
        // n???u c?? kh??c bi???t
        // x??? l?? hi???n th???: set row ???? modify, set l???i value m???i
        const updatedUsersListDisplay = usersListDisplay.map((row) => {
          if (row.id === id) {
            return { ...row, ismodify: true, [field]: valueDisplay };
          }
          return row;
        });
        setUsersListDisplay(updatedUsersListDisplay);
        // x??? l?? userListmodified
        if (indexUserExist !== -1) {
          // n???u ???? t???n t???i user modify
          const newUserListmodified = userListmodified.userListmodified.map(
            (user) => {
              // s???a l???i ph???n kh??c bi???t
              if (user.taiKhoan === id) {
                return { ...user, [field]: valueModified };
              }
              return user;
            }
          );
          setUserListmodified((data) => ({
            ...data,
            userListmodified: newUserListmodified,
          }));
          return;
        }
        setUserListmodified((data) => ({
          ...data,
          userListmodified: [
            ...userListmodified.userListmodified,
            { ...userOriginal, [field]: valueModified, maNhom: "GP09" },
          ],
        })); // n???u ch??a t???n t???i th?? push v??o
        return;
      }
      if (indexUserExist !== -1) {
        // n???u kh??ng kh??c bi???t v?? c?? trong danh s??ch modify
        let userModified = userListmodified.userListmodified[indexUserExist];
        userModified = { ...userModified, [field]: valueModified };
        const isMatKhauChange = userModified.matKhau !== userOriginal.matKhau;
        const isEmailChange = userModified.email !== userOriginal.email;
        const isSoDtChange = userModified.soDt !== userOriginal.soDt;
        const isMaLoaiNguoiDungChange =
          userModified.maLoaiNguoiDung !== userOriginal.maLoaiNguoiDung;
        const isHoTenChange = userModified.hoTen !== userOriginal.hoTen;
        const ismodify =
          isMatKhauChange ||
          isEmailChange ||
          isSoDtChange ||
          isMaLoaiNguoiDungChange ||
          isHoTenChange;
        // x??? l?? display
        const updatedUsersListDisplay = usersListDisplay.map((row) => {
          if (row.id === id) {
            return { ...row, ismodify, [field]: valueDisplay };
          }
          return row;
        });
        setUsersListDisplay(updatedUsersListDisplay);

        // n???u ismodify = true th?? c???p nh???t userListmodified
        if (ismodify) {
          const newUserListmodified = userListmodified.userListmodified.map(
            (user) => {
              if (user.taiKhoan === id) {
                return { ...userModified };
              }
              return user;
            }
          );
          setUserListmodified((data) => ({
            ...data,
            userListmodified: newUserListmodified,
          }));
          return;
        }
        // n???u ismodify = false th?? x??a user kh???i userListmodified
        const newUserListmodified = userListmodified.userListmodified.filter(
          (user) => user.taiKhoan !== id
        ); // x??a ra kh???i m???ng
        setUserListmodified((data) => ({
          ...data,
          userListmodified: newUserListmodified,
        }));
      }
    },
    [usersListDisplay, usersList, userListmodified, addUser]
  );

  const handleRefreshUserListResetChanged = () => {
    setUserListmodified({
      triggerUpdate: false,
      userListmodified: [],
      cancel: false,
    });
    setBtnReFresh(nanoid(6));
  };

  // x??a m???t user
  const handleDeleteOne = (taiKhoan) => {
    if (loadingDelete) {
      // n???u click x??a li??n t???c m???t user
      return;
    }
    dispatch(deleteUser(taiKhoan));
  };
  // x??a nhi???u user
  const handleDeleteMultiple = () => {
    if (userListDelete.triggerDelete !== false) {
      setUserListDelete((data) => ({
        ...data,
        cancel: true,
        triggerDelete: false,
      }));
      return;
    }
    setUserListDelete((data) => ({
      ...data,
      triggerDelete: nanoid(6),
      cancel: false,
    }));
  };
  // update nhi???u user
  const handleUpdateMultiple = () => {
    if (userListmodified.triggerUpdate !== false) {
      setUserListmodified((data) => ({
        ...data,
        cancel: true,
        triggerUpdate: false,
      }));
      return;
    }
    setUserListmodified((data) => ({
      ...data,
      triggerUpdate: nanoid(6),
      cancel: false,
    }));
  };

  const handleInputSearchChange = (props) => {
    clearTimeout(clearSetSearch.current);
    clearSetSearch.current = setTimeout(() => {
      setValueSearch(props);
    }, 500);
  };

  const handleToggleAddUser = () => {
    if (!addUser.isFilledIn) {
      // n???u ch??a ??i???n th?? toggle
      setaddUser((data) => ({ ...data, toggle: !addUser.toggle }));
      return;
    }
    if (addUser.readyAdd && !loadingAddUser) {
      // n???u ???? ??i???n v?? ???? s??n s??ng
      const userAdd = { ...addUser.data[0] };
      delete userAdd.id;
      dispatch(
        postAddUser({
          ...addUser.data[0],
          maLoaiNguoiDung: userAdd.maLoaiNguoiDung ? "QuanTri" : "KhachHang",
          maNhom: "GP09",
        })
      );
    }
  };

  const onFilter = () => {
    const searchUsersListDisplay = usersListDisplay.filter((user) => {
      const matchTaiKhoan =
        slugify(user.taiKhoan ?? "", modifySlugify)?.indexOf(
          slugify(valueSearch, modifySlugify)
        ) !== -1;
      const matchMatKhau =
        slugify(user.matKhau ?? "", modifySlugify)?.indexOf(
          slugify(valueSearch, modifySlugify)
        ) !== -1;
      const matchEmail =
        slugify(user.email ?? "", modifySlugify)?.indexOf(
          slugify(valueSearch, modifySlugify)
        ) !== -1;
      const matchSoDt =
        slugify(user.soDt ?? "", modifySlugify)?.indexOf(
          slugify(valueSearch, modifySlugify)
        ) !== -1;
      const matchHoTen =
        slugify(user.hoTen ?? "", modifySlugify)?.indexOf(
          slugify(valueSearch, modifySlugify)
        ) !== -1;
      return (
        matchTaiKhoan || matchMatKhau || matchEmail || matchSoDt || matchHoTen
      );
    });
    return searchUsersListDisplay;
  };

  const sortModel = useMemo(() => {
    return [
      {
        field: sortBy.field,
        sort: sortBy.sort,
      },
    ];
  }, [sortBy]);

  const columns = useMemo(
    () =>
      // c???t t??i kho???n kh??ng ???????c ch???nh s???a, backend d??ng "taiKhoan" ????? ?????nh danh user
      [
        {
          field: "xoa",
          headerName: "X??a",
          width: 100,
          renderCell: (params) => (
            <ButtonDelete
              onDeleted={handleDeleteOne}
              taiKhoan={params.row.taiKhoan}
            />
          ),
          headerAlign: "center",
          align: "center",
          headerClassName: "custom-header",
          hide: addUser.toggle,
        },
        {
          field: "taiKhoan",
          headerName: "T??i Kho???n",
          width: 250,
          editable: addUser.toggle,
          headerAlign: "center",
          align: "left",
          headerClassName: "custom-header",
        },
        {
          field: "matKhau",
          headerName: "M???t Kh???u",
          width: 300,
          editable: true,
          headerAlign: "center",
          align: "left",
          headerClassName: "custom-header",
        },
        {
          field: "hoTen",
          headerName: "H??? t??n",
          width: 300,
          editable: true,
          headerAlign: "center",
          align: "left",
          headerClassName: "custom-header",
        },
        {
          field: "email",
          headerName: "Email",
          width: 300,
          editable: true,
          headerAlign: "center",
          align: "left",
          headerClassName: "custom-header",
        },
        {
          field: "soDt",
          headerName: "S??? ??i???n tho???i",
          width: 200,
          editable: true,
          type: "number",
          headerAlign: "center",
          align: "left",
          headerClassName: "custom-header",
        },
        {
          field: "maLoaiNguoiDung",
          headerName: "isAdmin",
          width: 145,
          editable: true,
          type: "boolean",
          headerAlign: "center",
          align: "center",
          headerClassName: "custom-header",
        },
        {
          field: "ismodify",
          width: 0,
          type: "boolean",
          headerClassName: "custom-header",
          hide: true,
        },
      ],
    [addUser.toggle]
  );

  const modifySlugify = { lower: true, locale: "vi" };

  if (errorUsersList) {
    return <h1>{errorUsersList}</h1>;
  }

  return (
    <div style={{ height: "80vh", width: "100%" }}>
      <div className="container-fluid pb-3">
        <div className="row">
          <div className="col-12 pt-3 col-sm-6 col-md-4 col-lg-3">
            <Button
              variant="contained"
              color="secondary"
              disabled={userListDelete.userListDelete.length ? false : true}
              className={classes.button}
              startIcon={
                userListDelete.triggerDelete === false ? (
                  <DeleteIcon />
                ) : (
                  <CircularProgress size={20} color="inherit" />
                )
              }
              onClick={handleDeleteMultiple}
            >
              {userListDelete.triggerDelete === false ? "x??a" : "ng???ng x??a"}{" "}
              {userListDelete.userListDelete.length} user
            </Button>
          </div>
          <div className="col-12 pt-3 col-sm-6 col-md-4 col-lg-3">
            <Button
              variant="contained"
              color="primary"
              disabled={userListmodified.userListmodified.length ? false : true}
              className={classes.button}
              onClick={handleUpdateMultiple}
              startIcon={
                userListmodified.triggerUpdate === false ? (
                  <CloudUploadIcon />
                ) : (
                  <CircularProgress size={20} color="inherit" />
                )
              }
            >
              {userListmodified.triggerUpdate === false
                ? "c???p nh???t"
                : "h???y c???p nh???t"}{" "}
              {userListmodified.userListmodified.length} user
            </Button>
          </div>
          <div className="col-12 pt-3 col-sm-6 col-md-4 col-lg-3">
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={handleRefreshUserListResetChanged}
              startIcon={<CachedIcon />}
            >
              l??m m???i
            </Button>
          </div>
          <div className="col-12 pt-3 col-sm-6 col-md-4 col-lg-3">
            <Button
              variant="contained"
              color="primary"
              className={`${classes.addUser} ${classes.button}`}
              onClick={handleToggleAddUser}
              disabled={
                addUser.toggle
                  ? addUser.isFilledIn
                    ? addUser.readyAdd
                      ? false
                      : true
                    : false
                  : false
              }
              startIcon={
                addUser.toggle ? (
                  addUser.isFilledIn ? (
                    <PersonAddIcon />
                  ) : (
                    <EditIcon />
                  )
                ) : (
                  <PersonAddIcon />
                )
              }
            >
              {addUser.toggle
                ? addUser.isFilledIn
                  ? "th??m user"
                  : "qu???n l?? user"
                : "th??m user"}
            </Button>
          </div>
          <div className="col-12 pt-3 col-sm-6 col-md-4 col-lg-3">
            <Button
              variant="contained"
              className={`${classes.userKhachHang} ${classes.button}`}
              onClick={() =>
                setsortBy({ field: "maLoaiNguoiDung", sort: "asc" })
              }
            >
              User kh??ch h??ng
            </Button>
          </div>
          <div className="col-12 pt-3 col-sm-6 col-md-4 col-lg-3">
            <Button
              variant="contained"
              className={`${classes.userModified} ${classes.button}`}
              onClick={() => setsortBy({ field: "ismodify", sort: "desc" })}
            >
              User ???? ch???nh s???a
            </Button>
          </div>
          <div className="col-12 pt-3 col-sm-6 col-md-4 col-lg-3">
            <Button
              variant="contained"
              className={`${classes.userQuanTri} ${classes.button}`}
              onClick={() =>
                setsortBy({ field: "maLoaiNguoiDung", sort: "desc" })
              }
            >
              User qu???n tr???
            </Button>
          </div>
          <div className="col-12 pt-3 col-sm-6 col-md-4 col-lg-3">
            <div className={`${classes.search} ${classes.button}`}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search???"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                onChange={(evt) => handleInputSearchChange(evt.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      <DataGrid
        className={classes.rootDataGrid}
        rows={addUser.toggle ? addUser.data : onFilter()}
        columns={columns}
        pageSize={25}
        rowsPerPageOptions={[25, 50, 100]}
        // css m??u cho t??i kho???n QuanTri ho???c KhachHang: thay ?????i t??n class row d???a tr??n gi?? tr??? prop ri??ng bi???t c???a row
        getRowClassName={(params) => {
          return `isadmin--${params
            .getValue("maLoaiNguoiDung")
            .toString()} ismodify--${params.getValue("ismodify")?.toString()}`;
        }}
        // b???t checkbox
        checkboxSelection={!addUser.toggle}
        disableSelectionOnClick
        // khi click ch???n t???ng ph???n t??? ph???i l??u l???i
        onSelectionModelChange={(newSelection) => {
          if (newSelection.selectionModel.length === 0) {
            setUserListDelete({
              triggerDelete: false,
              userListDelete: [],
              cancel: false,
            });
          }
          setUserListDelete((data) => ({
            ...data,
            userListDelete: newSelection.selectionModel,
          }));
          setSelectionModel(newSelection.selectionModel);
        }}
        selectionModel={selectionModel}
        // x??? l?? ch???nh s???a
        editRowsModel={editRowsModel}
        onEditCellChange={handleEditCellChange}
        onEditCellChangeCommitted={handleEditCellChangeCommitted}
        // hi???n loading khi ??ang call api l???y userList
        loading={loadingUsersList}
        components={{ LoadingOverlay: CustomLoadingOverlay }}
        // sort
        sortModel={sortModel}
      />
    </div>
  );
}
