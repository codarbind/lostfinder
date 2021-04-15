import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import LostItemCard from './lostitem';
import FoundItemCard from './founditem'
import ReportLost from './reportlost'
import ReportFound from './reportfound'


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width:' 100%',
  },
}));

export default function FullWidthTabs() {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <div className={classes.root} style={{backgroundColor:'yellow'}}>
      <AppBar position="static" style={{backgroundColor:'black',}}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          
          variant="fullWidth"
          aria-label="full width tabs example"
          style={{color:'yellow'}}
        >
          <Tab label="LOST ITEMS" {...a11yProps(0)}  />
          <Tab label="FOUND ITEMS" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      
        <TabPanel value={value} index={0} dir={theme.direction}>
        <ReportLost />
          <p>List of items people are looking for</p>
          <LostItemCard />
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
        <ReportFound />
         <p>List of items we are looking for their owners</p>
         <FoundItemCard/>
        </TabPanel>
      
    </div>
  );
}
