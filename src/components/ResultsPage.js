import React from "React";
import ResultsTable from "./ResultsTable";
import HackyReferendaTable from "./HackyReferendaTable";
import "../sass/sanctions.scss";

class ResultsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sanctionData: 1,
      candidates: null
    };
  }

  getInfo() {
    fetch(
      "https://kerckhoff.dailybruin.com/api/packages/flatpages/usac.elections2018/"
    )
      .then(res => res.json())
      .then(data => {
        const sanctions = data.data["data.aml"].sanctions;
        const candidateData = data.data["data.aml"].profiles;
        const images = data.images.s3;
        candidateData.map(candidate => {
          candidate.candidates.map(indv => {
            if (indv.image) {
              const img = images[indv.image];
              if (img) {
                indv.image = img.url;
              }
            }
          });
        });
        //Get images from Kerckhoff
        console.log("candidates");
        console.log(candidateData);
        this.setState({ sanctionData: sanctions, candidates: candidateData });
      });
  }

  componentDidMount() {
    this.getInfo();
  }

  render() {
    // We want to separate sanctions (if one has multiple recipients create a sanction for each one)
    // Then we want to group the sanctions by candidate
    let table;
    if (!this.state.candidates) {
      return (
        <div>
          <h2>Loading...</h2>
        </div>
      );
    }
    table = this.state.candidates.map(position => {
      if (position.results != "") {
        return (
          <ResultsTable
            key={position.position}
            positionData={position}
            sanctions={this.state.sanctionData}
            candidateData={position.candidates}
            genRep={
              position.position == "General Representative" ? true : false
            }
          />
        );
      } else {
        return (
          <h2>Results for {position.position} have not been released yet.</h2>
        );
      }
    });
    // Group candidates by position
    return (
      <div>
        {table}
        <hr />
        <HackyReferendaTable />
      </div>
    );
  }
}

export default ResultsPage;
