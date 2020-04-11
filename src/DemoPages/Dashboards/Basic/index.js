import React, {Component, Fragment} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import classnames from 'classnames';

import {
    Row, Col,
    Button,
    CardHeader,
    Card,
    CardBody,
    Progress,
    TabContent,
    TabPane,
} from 'reactstrap';

import PageTitle from '../../../Layout/AppMain/PageTitle';

import {
    AreaChart, Area, Line,
    ResponsiveContainer,
    Bar,
    BarChart,
    ComposedChart,
    CartesianGrid,
    Tooltip,
    XAxis, YAxis,
    LineChart
} from 'recharts';

import {
    faAngleUp,
    faArrowRight,
    faArrowUp,
    faArrowLeft,
    faAngleDown
} from '@fortawesome/free-solid-svg-icons';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import avatar1 from '../../../assets/utils/images/avatars/1.jpg';
import avatar2 from '../../../assets/utils/images/avatars/2.jpg';
import avatar3 from '../../../assets/utils/images/avatars/3.jpg';
import avatar4 from '../../../assets/utils/images/avatars/4.jpg';


const data = [
    {name: 'Page A', uv: 4000, pv: 2400, amt: 2400},
    {name: 'Page B', uv: 3000, pv: 1398, amt: 2210},
    {name: 'Page C', uv: 2000, pv: 9800, amt: 2290},
    {name: 'Page D', uv: 2780, pv: 3908, amt: 2000},
    {name: 'Page E', uv: 1890, pv: 4800, amt: 2181},
    {name: 'Page F', uv: 2390, pv: 3800, amt: 2500},
    {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
    {name: 'Page C', uv: 2000, pv: 6800, amt: 2290},
    {name: 'Page D', uv: 4780, pv: 7908, amt: 2000},
    {name: 'Page E', uv: 2890, pv: 9800, amt: 2181},
    {name: 'Page F', uv: 1390, pv: 3800, amt: 1500},
    {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
];

const data2 = [
    {name: 'Page A', uv: 5400, pv: 5240, amt: 1240},
    {name: 'Page B', uv: 7300, pv: 4139, amt: 3221},
    {name: 'Page C', uv: 8200, pv: 7980, amt: 5229},
    {name: 'Page D', uv: 6278, pv: 4390, amt: 3200},
    {name: 'Page E', uv: 3189, pv: 7480, amt: 6218},
    {name: 'Page D', uv: 9478, pv: 6790, amt: 2200},
    {name: 'Page E', uv: 1289, pv: 1980, amt: 7218},
    {name: 'Page F', uv: 3139, pv: 2380, amt: 5150},
    {name: 'Page G', uv: 5349, pv: 3430, amt: 3210},
];

export default class AnalyticsDashboard1 extends Component {
    constructor() {
        super();

        this.state = {
            dropdownOpen: false,
            activeTab1: '11',
            latest : 0,
            discharged : 0,
            dischargedPercentage : 0,
            deaths : 0,
            confirmedCasesForeign : 0,
            graphResult : [],
            increasePercentage: 0,
            increaseCases : 0,
            increaseDischarge: 0,
            worldTotal : 0,
            usaTotal : 0,
            usaGraph : [],
            italyTotal: 0,

        };
        this.toggle = this.toggle.bind(this);
        this.toggle1 = this.toggle1.bind(this);

    }

    toggle() {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    }

    toggle1(tab) {
        if (this.state.activeTab1 !== tab) {
            this.setState({
                activeTab1: tab
            });
        }
    }

    componentDidMount() {
        fetch(`https://api.rootnet.in/covid19-in/stats/latest`)
            .then(res => res.json())
            .then(result => this.setState({ 
                total: result.data.summary.total,
                discharged :  result.data.summary.discharged,
                deaths : result.data.summary.deaths,
                confirmedCasesForeign : result.data.summary.confirmedCasesForeign
            }));

        fetch(`https://api.rootnet.in/covid19-in/stats/history`)
            .then(res => res.json())
            .then(result => {
                let graphData = [];
                result.data.forEach(item => {
                    graphData.push({day : item.day, count : item.summary.total})
                })
                let diff = result.data[result.data.length -1].summary.total - result.data[result.data.length - 2].summary.total
                let increasePercentage = (diff/result.data[result.data.length -1].summary.total)*100;
                let diffDischarge = result.data[result.data.length -1].summary.discharged - result.data[result.data.length - 2].summary.discharged;
                this.setState({
                    graphResult : graphData,
                    increasePercentage : increasePercentage.toFixed(2),
                    increaseCases : diff,
                    increaseDischarge : diffDischarge,
                    dischargedPercentage: ((result.data[result.data.length -1].summary.discharged /result.data[result.data.length -1].summary.total)*100).toFixed(2),
                })
            });
            fetch('https://corona.lmao.ninja/countries').then(res => res.json())
              .then(result => {
                  let italyTotal = result.filter(item => item.country ==="Italy")[0].cases;
                  let usaTotal = result.filter(item => item.country ==="USA")[0].cases;
                this.setState({
                    allCountries : result,
                    usaTotal : usaTotal,
                    italyTotal : italyTotal,
                   
                });
                this.setState({
                    topFiveCountry : this.topFiveCountry()
                })
              });

            fetch('https://corona.lmao.ninja/v2/historical').then(res => res.json())
            .then(result => {
                let usaFilter = result.filter(item => item.country ==="USA");
                let usaRes = usaFilter[0].timeline.cases
                var usaout = Object.keys(usaRes).map(function(data){
                    return {date : data, value : usaRes[data]};
                });

                let italyRes = result.filter(item => item.country ==="Italy")[0].timeline.cases;
                let italyOut = Object.keys(italyRes).map(function(data){
                    return {date : data, value : italyRes[data]};
                });
              this.setState({
                  usaGraph: usaout,
                  italyGraph : italyOut
              })
            });

    }

    topFiveCountry() {
        let temp = this.state.allCountries;
        temp.sort(function(a,b) {
            return a.cases - b.cases;
        });
        let countries = temp.slice(temp.length-5);
        const listItems = countries.map((country) =>
        <tr>
        <td className="text-center text-muted">#</td>
        <td>
            <div className="widget-content p-0">
                <div className="widget-content-wrapper">
                    <div className="widget-content-left flex2">
                    <div className="widget-heading">{country.country}</div>
                    </div>
                </div>
            </div>
        </td>
        <td className="text-center">{country.cases}</td>
        <td className="text-center">
    <div className="badge badge-warning">Danger</div>
        </td>
        <td className="text-center">
            <button type="button" className="btn btn-primary btn-sm">Details</button>
        </td>
    </tr>);
    return listItems;
    }

    render() {

        return (
            <Fragment>
                <ReactCSSTransitionGroup
                    component="div"
                    transitionName="TabsAnimation"
                    transitionAppear={true}
                    transitionAppearTimeout={0}
                    transitionEnter={false}
                    transitionLeave={false}>
                    <div>
                        <PageTitle
                            heading="India fight Covid-19 "
                            subheading="Below are the number that explains the current situation"
                            icon="pe-7s-car icon-gradient bg-mean-fruit"
                        />
                        <Row>
                            <Col md="12" lg="6">
                                <Card className="mb-3">
                                    <CardHeader className="card-header-tab">
                                        <div className="card-header-title">
                                            <i className="header-icon lnr-rocket icon-gradient bg-tempting-azure"> </i>
                                             Reports
                                        </div>
                                        <div className="btn-actions-pane-right">
                                            <Button outline
                                                    className={"border-0 btn-pill btn-wide btn-transition " + classnames({active: this.state.activeTab1 === '11'})}
                                                    color="primary" onClick={() => {
                                                this.toggle1('11');
                                            }}>India</Button>
                                            <Button outline
                                                    className={"ml-1 btn-pill btn-wide border-0 btn-transition " + classnames({active: this.state.activeTab1 === '22'})}
                                                    color="primary" onClick={() => {
                                                this.toggle1('22');
                                            }}>USA</Button>
                                        </div>
                                    </CardHeader>
                                    <TabContent activeTab={this.state.activeTab1}>
                                        <TabPane tabId="11">
                                            <CardBody className="pt-2">
                                                <Row className="mt-3">
                                                    <Col md="6">
                                                        <div className="widget-content marginTop-20">
                                                            <div className="widget-content-outer">
                                                                <div className="widget-content-wrapper">
                                                                    <div className="widget-content-left mr-3">
                                                                        <div className="widget-numbers fsize-3 text-muted">
                                                                            {this.state.increasePercentage}
                                                                        </div>
                                                                    </div>
                                                                    <div className="widget-content-right">
                                                                        <div className="text-muted opacity-6">
                                                                            Increase percentage
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="widget-progress-wrapper mt-1">
                                                                    <Progress
                                                                        className="progress-bar-sm progress-bar-animated-alt"
                                                                        color="danger"
                                                                        value={this.state.increasePercentage}/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                    <Col md="6">
                                                        <div className="widget-content marginTop-20">
                                                            <div className="widget-content-outer">
                                                                <div className="widget-content-wrapper">
                                                                    <div className="widget-content-left mr-3">
                                                                        <div className="widget-numbers fsize-3 text-muted">
                                                                            {this.state.dischargedPercentage}
                                                                        </div>
                                                                    </div>
                                                                    <div className="widget-content-right">
                                                                        <div className="text-muted opacity-6">
                                                                            Discharged percentage
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="widget-progress-wrapper mt-1">
                                                                    <Progress
                                                                        className="progress-bar-sm progress-bar-animated-alt"
                                                                        color="success"
                                                                        value={this.state.dischargedPercentage}/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <div className="divider mt-4"/>
                                            </CardBody>
                                            <div className="widget-chart p-0">
                                                <div className="widget-chart-content">
                                                    <div className="widget-description mt-0 text-warning">
                                                        <FontAwesomeIcon icon={faArrowUp}/>
                                                        <span className="pl-1"> {this.state.increasePercentage}%</span>
                                                        <span className="text-muted opacity-8 pl-1">increased</span>
                                                    </div>
                                                </div>
                                                <ResponsiveContainer height={240}>
                                                    <AreaChart data={this.state.graphResult} margin={{top: -45, right: 0, left: 0, bottom: 0}}>
                                                        <defs>
                                                            <linearGradient id="colorPv2" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="10%" stopColor="var(--warning)" stopOpacity={0.7}/>
                                                                <stop offset="90%" stopColor="var(--warning)" stopOpacity={0}/>
                                                            </linearGradient>
                                                        </defs>
                                                        <XAxis dataKey="day" />
                                                        <YAxis />
                                                        <Tooltip/>
                                                        <Area type='monotoneX' dataKey='count' stroke='var(--warning)' strokeWidth={2} fillOpacity={1}
                                                              fill="url(#colorPv2)"/>
                                                    </AreaChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </TabPane>
                                        <TabPane tabId="22">
                                            <div className="widget-chart p-0">
                                                <ResponsiveContainer height={240}>
                                                    <ComposedChart data={this.state.usaGraph}>
                                                        <CartesianGrid stroke="#ffffff"/>
                                                        
                                                        <Bar dataKey="value" barSize={16} fill="var(--primary)"/>
                                                        <Line type="monotone" dataKey="value" strokeWidth="3" stroke="var(--danger)"/>
                                                        <XAxis dataKey="date" />
                                                        <YAxis />
                                                        <Tooltip/>
                                                    </ComposedChart>
                                                </ResponsiveContainer>
                                                <div className="widget-chart-content mt-3 mb-2">
                                                    <div className="widget-description mt-0 text-success">
                                                        <FontAwesomeIcon icon={faArrowUp}/>
                                                        <span className="pl-2 pr-2">37.2%</span>
                                                        <span className="text-muted opacity-8"> Increase</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <CardBody className="pt-2">
                                                <Row>
                                                    <Col md="6">
                                                        <div className="widget-content marginTop-20">
                                                            <div className="widget-content-outer">
                                                                <div className="widget-content-wrapper">
                                                                    <div className="widget-content-left mr-3">
                                                                        <div className="widget-numbers fsize-3 text-muted">
                                                                            23%
                                                                        </div>
                                                                    </div>
                                                                    <div className="widget-content-right">
                                                                        <div className="text-muted opacity-6">
                                                                            Raise in cases
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="widget-progress-wrapper mt-1">
                                                                    <Progress
                                                                        className="progress-bar-sm progress-bar-animated-alt"
                                                                        color="warning"
                                                                        value="23"/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                    <Col md="6">
                                                        <div className="widget-content marginTop-20">
                                                            <div className="widget-content-outer">
                                                                <div className="widget-content-wrapper">
                                                                    <div className="widget-content-left mr-3">
                                                                        <div className="widget-numbers fsize-3 text-muted">
                                                                            37.2%
                                                                        </div>
                                                                    </div>
                                                                    <div className="widget-content-right">
                                                                        <div className="text-muted opacity-6">
                                                                            Increase percentage
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="widget-progress-wrapper mt-1">
                                                                    <Progress
                                                                        className="progress-bar-sm progress-bar-animated-alt"
                                                                        color="info"
                                                                        value="37.2"/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <div className="divider mt-4"/>                                                
                                            </CardBody>
                                        </TabPane>
                                    </TabContent>
                                </Card>
                                <Row>
                                    <Col lg="6">
                                        <div className="card mb-3 widget-chart">
                                            <div className="widget-chart-content">
                                                <div className="icon-wrapper rounded-circle">
                                                    <div className="icon-wrapper-bg bg-primary"/>
                                                    <i className="pe-7s-bell text-primary"/>
                                                </div>
                                                <div className="widget-numbers">
                                                    {this.state.total}
                                                </div>
                                                <div className="widget-subheading">
                                                    Total cases in india
                                                </div>
                                                <div className="widget-description text-success">
                                                    <FontAwesomeIcon icon={faAngleUp}/>
                                                    <span className="pl-1">{this.state.increasePercentage}%</span>
                                                </div>
                                            </div>
                                            <div className="widget-chart-wrapper chart-wrapper-relative">
                                                <ResponsiveContainer height={100}>
                                                    <LineChart data={this.state.graphResult}
                                                               margin={{top: 5, right: 5, left: 5, bottom: 0}}>
                                                        <Line type='monotone' dataKey='count' stroke='#3ac47d'
                                                              strokeWidth={3}/>
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col lg="6">
                                        <div className="card mb-3 widget-chart">
                                            <div className="widget-chart-content">
                                                <div className="icon-wrapper rounded-circle">
                                                    <div className="icon-wrapper-bg bg-danger"/>
                                                    <i className="pe-7s-graph1 text-danger"/>
                                                </div>
                                                <div className="widget-numbers">
                                                    {this.state.italyTotal}
                                                </div>
                                                <div className="widget-subheading">
                                                    Cases in Italy
                                                </div>
                                                <div className="widget-description text-danger">
                                                    <FontAwesomeIcon icon={faAngleUp}/>
                                                    <span className="pl-1"></span>
                                                </div>
                                            </div>
                                            <div className="widget-chart-wrapper chart-wrapper-relative">
                                                <ResponsiveContainer height={100}>
                                                    <BarChart data={this.state.italyGraph}>
                                                        <Bar dataKey='value' fill='#81a4ff' stroke='#3f6ad8' strokeWidth={2}/>
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                            <Col md="12" lg="6">
                                <Row>
                                    <Col md="6">
                                        <div className="card mb-3 bg-arielle-smile widget-chart text-white card-border">
                                            <div className="icon-wrapper rounded-circle">
                                                <div className="icon-wrapper-bg bg-white opacity-10"/>
                                                <i className="lnr-cog icon-gradient bg-arielle-smile"/>
                                            </div>
                                            <div className="widget-numbers">
                                            {this.state.total}
                                            </div>
                                            <div className="widget-subheading">
                                                Total cases in India
                                            </div>
                                            <div className="widget-description text-white">
                                                <FontAwesomeIcon icon={faAngleUp}/>
                                                <span className="pl-1">{this.state.increaseCases}</span>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md="6">
                                        <div className="card mb-3 bg-grow-early widget-chart text-white card-border">
                                            <div className="icon-wrapper rounded">
                                                <div className="icon-wrapper-bg bg-white opacity-10"/>
                                                <i className="pe-7s-home icon-gradient bg-warm-flame"/>
                                            </div>
                                            <div className="widget-numbers">
                                                {this.state.discharged}
                                            </div>
                                            <div className="widget-subheading">
                                                Discharged
                                            </div>
                                            <div className="widget-description text-white">
                                        <span className="pr-1">{this.state.increaseDischarge}</span>
                                                <FontAwesomeIcon icon={faArrowUp}/>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md="6">
                                        <div className="card mb-3 bg-midnight-bloom widget-chart text-white card-border">
                                            <div className="icon-wrapper rounded">
                                                <div className="icon-wrapper-bg bg-dark opacity-9"/>
                                                <i className="pe-7s-plane text-white"/>
                                            </div>
                                            <div className="widget-numbers">
                                                {this.state.confirmedCasesForeign}
                                            </div>
                                            <div className="widget-subheading">
                                            Confirmed Cases Foreign
                                            </div>
                                            <div className="widget-description text-white">
                                                <FontAwesomeIcon icon={faArrowRight}/>
                                                <span className="pl-1"></span>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md="6">
                                        <div className="card mb-3 bg-love-kiss widget-chart card-border">
                                            <div className="widget-chart-content text-white">
                                                <div className="icon-wrapper rounded-circle">
                                                    <div className="icon-wrapper-bg bg-white opacity-4"/>
                                                    <i className="pe-7s-attention"/>
                                                </div>
                                                <div className="widget-numbers">
                                                    {this.state.deaths}
                                                </div>
                                                <div className="widget-subheading">
                                                    Deaths
                                                </div>
                                                <div className="widget-description">
                                                    <FontAwesomeIcon className="text-white opacity-5" icon={faAngleUp}/>
                                                    <span className="text-white"></span>
                                                </div>
                                            </div>
                                            <div className="widget-chart-wrapper">
                                                <ResponsiveContainer width='100%' aspect={3.0 / 1.0}>
                                                    <LineChart data={data}
                                                               margin={{top: 0, right: 5, left: 5, bottom: 0}}>
                                                        <Line type='monotone' dataKey='pv' stroke='#ffffff' strokeWidth={3}/>
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                                <div className="card mb-3 widget-chart">
                                    <div className="widget-chart-content">
                                        <div className="icon-wrapper rounded-circle">
                                            <div className="icon-wrapper-bg bg-warning"/>
                                            <i className="pe-7s-arc icon-gradient bg-premium-dark"> </i>
                                        </div>
                                        <div className="widget-numbers">
                                            {this.state.usaTotal}
                                        </div>
                                        <div className="widget-subheading">
                                            USA total cases
                                        </div>
                                        <div className="widget-description">
                                            Up by
                                            <span className="text-danger pl-1 pr-1">
                                                <FontAwesomeIcon icon={faAngleUp}/>
                                                <span className="pl-1">54.1%</span>
                                            </span>
                                            from 30 days ago
                                        </div>
                                    </div>
                                    <div className="widget-chart-wrapper chart-wrapper-relative">
                                        <ResponsiveContainer height={100}>
                                            <LineChart data={this.state.usaGraph}
                                                       margin={{top: 0, right: 5, left: 5, bottom: 0}}>
                                                <Line type="monotone" dataKey="value" stroke="#d6b5ff" strokeWidth={2}/>
                                                <Line type="monotone" dataKey="value" stroke="#a75fff" strokeWidth={2}/>
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="12">
                                <Card className="main-card mb-3">
                                    <div className="card-header">Highly affected countries
                                        <div className="btn-actions-pane-right">
                                            <div role="group" className="btn-group-sm btn-group">
                                                <button className="active btn btn-info">Last Week</button>
                                                <button className="btn btn-info">All Month</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="align-middle mb-0 table table-borderless table-striped table-hover">
                                            <thead>
                                            <tr>
                                                <th className="text-center">#</th>
                                                <th>Country</th>
                                                <th className="text-center">Cases</th>
                                                <th className="text-center">Status</th>
                                                <th className="text-center">Actions</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.topFiveCountry}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="d-block text-center card-footer">
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                        <Row>

                        </Row>
                    </div>
                </ReactCSSTransitionGroup>
            </Fragment>
        )
    }
}
