import { React, useEffect, useState } from "react";
import {
  Grid,
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  TextField,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import PropTypes from "prop-types";

// eslint-disable-next-line react/prop-types
const SkillsCard = ({ setProfile, profile, visitingProfile }) => {
  // Set the strings based on the language defined by the user
  const { t, i18n } = useTranslation();

  const [skillsStr, setSkillsStr] = useState("");
  const [editButton, setEditButton] = useState(false);
  const [skillArr, setSkillArr] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const [tempSkill, setTempSkill] = useState("");

  useEffect(() => {
    console.log(profile.values.skills);
    //setSkillsStr(profile.values.skills);
    if (profile.values.skills !== "") {
      setSkillArr(profile.values.skills.split(","));
    }
  }, []);

  useEffect(() => {
    console.log(skillsStr);
    setProfile({ values: { ...profile.values, skills: skillsStr } });
  }, [skillsStr]);

  useEffect(() => {
    console.log(skillArr);
    setSkillsStr(skillArr.join());
  }, [skillArr]);

  const handleAdd = () => {
    if (!skillArr.includes(tempSkill) && tempSkill.length > 0) {
      setSkillArr((prevList) => [...prevList, tempSkill]);
    }
    setTempSkill("");
  };

  return (
    <Box>
      <Card variant="outlined" sx={{ mx: 0 }}>
        <CardContent>
          <Grid container justifyContent="space-between">
            <Grid item>
              <Typography variant="h5"> {t("Skills")}</Typography>
            </Grid>
            <Grid item>
              <EditIcon
                onClick={() => setEditButton(!editButton)}
                style={{
                  cursor: "pointer",
                  display: visitingProfile ? "none" : "inline",
                }}
              />
            </Grid>
          </Grid>
          <Grid container>
            <TextField
              label={t("Skill")}
              name="SkillInput"
              variant="standard"
              size="small"
              value={tempSkill}
              helperText={errMsg}
              onChange={(e) => {
                const newValue = e.target.value;
                if (!newValue.match(/[\\'",.;]/)) {
                  setErrMsg("");
                  setTempSkill(newValue);
                } else {
                  setErrMsg("Forbidden character: '\",.;\\");
                }
              }}
              InputProps={{
                endAdornment: (
                  <AddIcon
                    onClick={handleAdd}
                    style={{
                      cursor: "pointer",
                      display: visitingProfile ? "none" : "inline",
                    }}
                    name="skillAdd"
                  />
                ),
                readOnly: !editButton,
                error: editButton,
              }}
            />
          </Grid>
          {/* Would like to turn this into tags that can be deleted */}
          {!visitingProfile ? (
            <Grid container spacing={1} style={{ marginTop: "1%" }}>
              {skillArr.length > 0 &&
                skillArr.map((data) => (
                  <Chip
                    sx={{ m: "0.25%" }}
                    key={data}
                    color="info"
                    label={data}
                    variant="outlined"
                    onDelete={() =>
                      setSkillArr((prev) =>
                        prev.filter((temp) => temp !== data)
                      )
                    }
                  />
                ))}
            </Grid>
          ) : (
            <Grid container spacing={1} style={{ marginTop: "1%" }}>
              {skillArr.length > 0 &&
                skillArr.map((data) => (
                  <Chip
                    sx={{ m: "0.25%" }}
                    key={data}
                    color="info"
                    label={data}
                    variant="outlined"
                  />
                ))}
            </Grid>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

SkillsCard.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  profile: PropTypes.objectOf(PropTypes.any),
  visitingProfile: PropTypes.bool,
};

export default SkillsCard;
