import { ExpandLessRounded, ExpandMoreRounded, FileDownloadRounded } from "@mui/icons-material";
import { CircularProgress, Fade, Menu } from "@mui/material";
import MDButton from "components/MDButton";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import DropdownItem from "./DropdownItem";

const ExtractButton = ({ t, getData, module }) => {
    const [extracting, setExtracting] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const { page } = useSelector((state) => state.dead);

    const handleExcel = async () => {
        // alphabets for iterating cells
        const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        try {
            setExtracting(true);

            // getting formatted data and creating columns
            const data = getData();
            const cols = Object.keys(data[0]).map((title) => ({ header: title, key: title }));

            // the name of the file based on module
            const name =
                module === "HDs"
                    ? `تقرير تكريم المتوفيين صفحة ${page}.xlsx`
                    : `report page: ${page}`;

            // initializing the workbook i.e xlsx document
            const now = new Date();

            const workbook = new ExcelJS.Workbook();
            workbook.creator = "e-khadmat";
            workbook.lastModifiedBy = "e-khadmat";
            workbook.created = now;
            workbook.modified = now;
            workbook.lastPrinted = now;

            // creating the first sheet
            const worksheet = workbook.addWorksheet(`صفحة ${page}`);

            // inserting the logo
            const res = await fetch(`${process.env.PUBLIC_URL}/static/img/logo.png`);
            const file = await res.arrayBuffer();

            const img = workbook.addImage({
                buffer: file,
                extension: "png",
            });
            worksheet.addImage(img, "A1:B2");

            // creating the first row i.e columns heads and styling
            const firstRow = Object.keys(cols).map((col, i) => cols[i].header);
            worksheet.addRow();
            worksheet.getRow(3).values = firstRow;
            worksheet.getRow(3).font = { bold: true, size: 13, color: { argb: "FFFFFF" } };
            worksheet.columns = cols;

            // mergin the first few cells for the logo and title
            const colCount = worksheet.columnCount;
            worksheet.mergeCells(`A1:${alphabets[colCount - 1]}2`);
            worksheet.getRow(1).values = [];

            // adding title and styling
            worksheet.getCell("A1").value = name.split(".xlsx")[0];
            worksheet.getCell("A1").fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "F0F2F2" },
            };
            worksheet.getCell("A1").font = {
                bold: true,
                size: 14,
            };
            worksheet.getCell("A1").alignment = { vertical: "middle", horizontal: "center" };

            // adding the formatted data
            worksheet.addRows(data);

            // centering the data in each cell
            worksheet.eachRow((row) => {
                row.alignment = { vertical: "middle", horizontal: "center" };
            });

            // adding background for the headers and borders for all cells
            [...Array(colCount).keys()].forEach((i) => {
                worksheet.getCell(`${alphabets[i]}3`).fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "00874B" },
                };

                worksheet.getColumn(i + 1).eachCell((cell) => {
                    cell.border = {
                        top: { style: "thin" },
                        bottom: { style: "thin" },
                        left: { style: "thin" },
                        right: { style: "thin" },
                    };
                });
            });

            // creating buffer for downloading
            const buffer = await workbook.xlsx.writeBuffer({
                useStyles: true,
            });

            // creating the blob
            const blob = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8",
            });

            // closing the menu
            setAnchorEl(null);

            // download using FileSaver library
            saveAs(blob, name);

            setExtracting(false);
        } catch (err) {
            console.error({ err });
            toast.error(t("common.error.unknown"));
            setExtracting(false);
        }
    };

    return (
        <>
            <MDButton
                variant="text"
                color="info"
                sx={{ fontSize: 20, width: 180 }}
                endIcon={open ? <ExpandLessRounded /> : <ExpandMoreRounded />}
                onClick={(e) => setAnchorEl(e.currentTarget)}
            >
                {t("common.extract")}
            </MDButton>
            <Menu
                open={open}
                anchorEl={anchorEl}
                TransitionComponent={Fade}
                onClose={() => setAnchorEl(null)}
                disableScrollLock
            >
                {extracting ? (
                    <DropdownItem
                        label={t("common.loading")}
                        icon={<CircularProgress size={10} color="inherit" />}
                    />
                ) : (
                    <DropdownItem
                        icon={<FileDownloadRounded />}
                        label={"Excel"}
                        onClick={handleExcel}
                    />
                )}
            </Menu>
        </>
    );
};

export default ExtractButton;
