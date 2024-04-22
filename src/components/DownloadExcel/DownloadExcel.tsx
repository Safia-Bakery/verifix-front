import { baseURL } from "@/api/baseApi";
import useQueryString from "@/hooks/custom/useQueryString";
import useDivExcell from "@/hooks/useDivExcell";
import { yearMonthDate } from "@/utils/helper";
import dayjs from "dayjs";
import React, { useEffect } from "react";
import Button from "../Button";
import { BtnTypes } from "@/utils/types";

export const DownloadExcel = () => {
    const start = useQueryString("start") || dayjs().format(yearMonthDate);
    const end = useQueryString("end") || dayjs().format(yearMonthDate);

    const { } = uploadExcelMutation;

    const {
        data: excelFile, isLoading: excellLoading, refetch: excellRefetch,
    } = useDivExcell({
        from_date: start,
        to_date: end,
        enabled: false,
    });
    useEffect(() => {
        if (excelFile && excelFile?.file_name) {
            const url = `${baseURL}/files/${excelFile.file_name}`;
            const a = document.createElement("a");
            a.href = url;
            a.target = "_blank";
            document.body.appendChild(a);
            a.click();

            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    }, [excelFile]);

    const handleChange = (e) => {
    };
    return (
        <div className="flex gap-2">
            <Button btnType={BtnTypes.brown} className="relative cursor-pointer">
                <input
                    onChange=
            type="file"
                    className="absolute inset-0 opacity-0 z-10 cursor-pointer" />
                Загрузить Excell
            </Button>
            <Button onClick={() => excellRefetch()} btnType={BtnTypes.green}>
                Скачать Excell
            </Button>
        </div>
    );
};
