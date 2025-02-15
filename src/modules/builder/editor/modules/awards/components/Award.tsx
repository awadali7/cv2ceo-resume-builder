import React, { ChangeEvent, Fragment, useCallback } from "react";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { useCertificates } from "@/stores/certificate";
import { ICertificateItem } from "@/stores/certificate.interface";
import { RichtextEditor } from "@/helpers/common/components/richtext";
import { DATE_PICKER_FORMAT } from "@/helpers/constants";
import dayjs from "dayjs";

interface ICertificateComp {
  awardInfo: ICertificateItem;
  currentIndex: number;
}

const AwardComp: React.FC<ICertificateComp> = ({ awardInfo, currentIndex }) => {
  const onChangeHandler = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (name: string, value: any) => {
      const currentAwardInfo = { ...awardInfo };
      const updateCertificate = useCertificates.getState().updateCertificate;
      switch (name) {
        case "title":
          currentAwardInfo.title = value;
          break;
        case "certificater":
          currentAwardInfo.certificater = value;
          break;
        case "date":
          currentAwardInfo.date = value;
          break;
        case "summary":
          currentAwardInfo.summary = value;
          break;
        default:
          break;
      }
      updateCertificate(currentIndex, currentAwardInfo);
    },
    [currentIndex, awardInfo],
  );

  const onSummaryChange = useCallback(
    (htmlOutput: string) => {
      onChangeHandler("summary", htmlOutput);
    },
    [onChangeHandler],
  );

  return (
    <Fragment>
      <TextField
        label="Certificate name"
        variant="filled"
        value={awardInfo.title}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value;
          onChangeHandler("title", value);
        }}
        autoComplete="off"
        fullWidth
        required
        autoFocus={true}
        sx={{ marginBottom: "26px" }}
      />
      <TextField
        label="Certificate by"
        variant="filled"
        value={awardInfo.certificater}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value;
          onChangeHandler("certificater", value);
        }}
        autoComplete="off"
        fullWidth
        required
        sx={{ marginBottom: "26px" }}
      />
      <DatePicker
        label="Date"
        value={dayjs(awardInfo.date)}
        onChange={(newDate) => {
          onChangeHandler("date", newDate);
        }}
        format={DATE_PICKER_FORMAT}
        slotProps={{
          textField: {
            variant: "filled",
            autoComplete: "off",
            fullWidth: true,
            required: true,
            sx: { marginBottom: "26px" },
          },
        }}
      />
      <RichtextEditor
        label="About the certificate"
        value={awardInfo.summary}
        onChange={onSummaryChange}
        name="summary"
      />
    </Fragment>
  );
};

export default AwardComp;
