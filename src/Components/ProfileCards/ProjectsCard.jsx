import { React, useState } from "react";
import {
  Grid,
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PropTypes from "prop-types";

const ProjectsCard = ({ profile, setProfile }) => {
  const something = "";
  const [editButton, setEditButton] = useState(false);
  return (
    <Box>
      <Card variant="outlined" sx={{ mx: 5 }}>
        <CardContent>
          <Grid container justifyContent="space-between">
            <Grid item>
              <Typography variant="h5"> Projects </Typography>
            </Grid>
            <Grid item>
              <EditIcon
                onClick={() => setEditButton(!editButton)}
                style={{ cursor: "pointer" }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item>
              <TextField
                label="Project Title"
                variant="standard"
                size="small"
                value={profile.values.project}
                onChange={(e) =>
                  setProfile({
                    values: { ...profile.values, project: e.target.value },
                  })
                }
                InputProps={{
                  readOnly: !editButton,
                  error: editButton,
                }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item>
              <TextField
                label="Project Description"
                variant="standard"
                size="small"
                multiline
                maxRows={4}
                value={profile.values.projectDesc}
                onChange={(e) =>
                  setProfile({
                    values: { ...profile.values, projectDesc: e.target.value },
                  })
                }
                InputProps={{
                  readOnly: !editButton,
                  error: editButton,
                }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

ProjectsCard.propTypes = {
  profile: PropTypes.objectOf(PropTypes.any),
  setProfile: PropTypes.func,
};

export default ProjectsCard;
