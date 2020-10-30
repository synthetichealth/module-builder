import React, { Component } from "react";
import "./LoadModule.css";
import { generateDOT } from "../../utils/graphviz";
import StyledDropzone from "./StyledDropZone";
import Generator from "ecqm-module-generator";

class LoadModule extends Component {
  constructor(props) {
    super(props);
    this.state = { json: "", selectedOption: "core" };
  }

  loadModule = (json) => {
    try {
      let module = JSON.parse(json);

      if (module.name === undefined) {
        throw new Error("Module must have a name.");
      }

      if (
        module.states === undefined ||
        Object.keys(module.states).length === 0
      ) {
        throw new Error("Module must have at least one state.");
      }

      let tableMessage = "";

      // need to get the tables for any table transition
      for (var key in module.states) {
        if (module.states[key].lookup_table_transition != null) {
          tableMessage += key.toString() + " & ";

          // this is an awful hack to get around a data model mismatch
          const lttWrapper = {
            type: "Table",
            transitions: module.states[key].lookup_table_transition,
          };
          module.states[key].lookup_table_transition = lttWrapper;

          // put default data in for state of the table transition
          module.states[
            key
          ].lookup_table_transition.lookup_table_name_ModuleBuilder =
            module.states[
              key
            ].lookup_table_transition.transitions[0].lookup_table_name;
          module.states[key].lookup_table_transition.viewTable = false;
          module.states[key].lookup_table_transition.lookuptable = "";
        }
      }

      if (tableMessage.length > 0) {
        tableMessage = tableMessage.substr(0, tableMessage.length - 2);
        // make a pop-up to tell the user to enter the table data
        alert(
          "Table Transition must be filled out in Module Builder for " +
            tableMessage
        );
      }
      // this will throw an error if the module is incomprehensible
      let dot = generateDOT(module);

      this.props.newModule(module);
      this.setState({ ...this.state, json: "", selectedOption: "core" });
    } catch (ex) {
      alert("Error creating module: " + ex.message);
    }
  };

  onClick = (key) => {
    return () => {
      this.setState({ ...this.state, json: "", selectedOption: "core" });
      this.props.push("#" + key);
    };
  };

  onDrop = (files) => {
    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        this.loadModule(reader.result);
      };
      reader.readAsText(file);
    });
  };

  onLoadJSON = () => {
    this.loadModule(this.state.json);
  };

  onOptionClick = (key) => {
    return () => {
      this.setState({ ...this.state, selectedOption: key });
    };
  };

  updateJson = (event) => {
    this.setState({ ...this.state, json: event.target.value });
  };

  renderFooter = () => {
    let loadButton = <span />;
    if (this.state.selectedOption === "json") {
      loadButton = (
        <button
          type="button"
          className="btn btn-secondary"
          data-dismiss="modal"
          onClick={this.onLoadJSON}
        >
          Load
        </button>
      );
    }
    let closeButton = <span />;
    if (!this.props.welcome) {
      closeButton = (
        <button
          type="button"
          className="btn btn-secondary"
          data-dismiss="modal"
          onClick={this.props.onHide}
        >
          Close
        </button>
      );
    }

    return (
      <div className="modal-footer" style={{ height: 69 }}>
        {loadButton}
        {closeButton}
      </div>
    );
  };

  renderDetails = () => {
    switch (this.state.selectedOption) {
      case "core":
        return (
          <ul className="LoadModule-list">
            {Object.keys(this.props.library)
              .filter((n) => n.indexOf("/") === -1)
              .map((key, index) => {
                let module = this.props.library[key];
                return (
                  <li key={key}>
                    <button
                      className="btn btn-link"
                      onClick={this.onClick(key)}
                    >
                      {module.name}
                    </button>
                  </li>
                );
              })}
          </ul>
        );

      case "submodules":
        return (
          <ul className="LoadModule-list">
            {Object.keys(this.props.library)
              .filter((n) => n.indexOf("/") > -1)
              .map((key, index) => {
                let module = this.props.library[key];
                return (
                  <li key={key}>
                    <button
                      className="btn btn-link"
                      onClick={this.onClick(key)}
                    >
                      {key.split("/")[0] + ": " + module.name}
                    </button>
                  </li>
                );
              })}
          </ul>
        );

      case "my":
        return (
          <ul className="LoadModule-list">
            {Object.keys(this.props.modules).map((key, index) => {
              let module = this.props.modules[key];
              return (
                <li key={key}>
                  <button className="btn btn-link" onClick={this.onClick(key)}>
                    {module.name} ({key})
                  </button>
                </li>
              );
            })}
          </ul>
        );

      case "json":
        return (
          <textarea
            id="loadJSON"
            value={this.state.json}
            onChange={this.updateJson}
          ></textarea>
        );

      case "git":
        let moduleList = null;
        let submoduleList = null;
        if (this.state.Modules) {
          moduleList = (
            <div className="col-4 nopadding">
              <ul className="LoadModule-list">
                {this.state.Folders}
                {this.state.Modules}
              </ul>
            </div>
          );
          if (this.state.Submodules) {
            submoduleList = (
              <div className="col-4 nopadding">
                <ul className="LoadModule-list">{this.state.Submodules}</ul>
              </div>
            );
          }
        }
        return (
          <div className="row">
            <ul className="LoadModule-list">{this.state.Branches}</ul>
            {moduleList}
            {submoduleList}
          </div>
        );

      case "ecqm":
        return (
          <div className="row">
            <ul className="LoadECQMBundle-list">{this.state.Bundles}</ul>
          </div>
        );
      default:
        return;
    }
  };

  changeColor(ID, type) {
    document.getElementById(ID).style.backgroundColor = "#ddd";
    let list = null;
    switch (type) {
      case "branch":
        list = this.state.Branches;
        break;
      case "module":
        list = this.state.Modules;
        break;
      case "folder":
        list = this.state.Folders;
        break;
      default:
        break;
    }
    list.forEach((i) => {
      if (i.props.id !== ID) {
        document.getElementById(i.props.id).style.backgroundColor = "#eee";
      }
    });
  }

  fetchBranchList() {
    fetch(`https://api.github.com/repos/synthetichealth/synthea/branches`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          Branches: data.map((branch, i) => (
            <li key={i} id={branch.name}>
              <button
                className="btn btn-link"
                onClick={() => {
                  this.changeColor(branch.name, "branch");
                  this.fetchModuleList(branch.name);
                }}
              >
                {branch.name}
              </button>
            </li>
          )),
        });
      })
      .catch((error) => console.log("error: ", error));
  }

  fetchModuleList(branch) {
    this.setState({
      currentBranch: branch,
    });
    fetch(
      `https://api.github.com/repos/synthetichealth/synthea/contents/src/main/resources/modules?ref=` +
        branch
    )
      .then((response) => response.json())
      .then((data) => {
        let folders = data.filter((name) => !name.name.includes(".json"));
        let modules = data.filter((name) => name.name.includes(".json"));
        this.setState({
          Folders: folders.map((name, i) => (
            <li key={i} id={name.name}>
              <button
                className="btn btn-link"
                onClick={() => {
                  this.changeColor(name.name, "folder");
                  this.fetchModule(name.name);
                }}
              >
                {name.name}/
              </button>
            </li>
          )),
          Modules: modules.map((name, i) => (
            <li key={i} id={name.name}>
              <button
                className="btn btn-link"
                onClick={() => {
                  this.changeColor(name.name, "module");
                  this.fetchModule(name.name);
                }}
              >
                {name.name}
              </button>
            </li>
          )),
        });
      })
      .catch((error) => console.log("error: ", error));
  }

  fetchModule(name) {
    this.setState({
      currentModule: name,
    });
    if (name.includes(".json")) {
      fetch(
        `https://raw.githubusercontent.com/synthetichealth/synthea/` +
          this.state.currentBranch +
          `/src/main/resources/modules/` +
          name
      )
        .then((response) => response.text())
        .then((data) => this.loadModule(data))
        .then(
          this.setState({
            Modules: null,
          })
        )
        .catch((error) => console.log("error: ", error));
    } else {
      fetch(
        `https://api.github.com/repos/synthetichealth/synthea/contents/src/main/resources/modules/` +
          name +
          `?ref=` +
          this.state.currentBranch
      )
        .then((response) => response.json())
        .then((data) =>
          this.setState({
            Submodules: data.map((name, i) => (
              <li key={i} id={name.name}>
                <button
                  className="btn btn-link"
                  onClick={() => {
                    this.fetchSubmodule(name.name);
                  }}
                >
                  {name.name}
                </button>
              </li>
            )),
          })
        )
        .catch((error) => console.log("error: ", error));
    }
  }

  fetchECQMBundles(name) {
    fetch(
      `https://api.github.com/repos/dbcg/connectathon/contents/fhir401/bundles`
    )
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          Bundles: data.map((name, i) => (
            <li key={i} id={name.name}>
              <button
                className="btn btn-link"
                onClick={() => {
                  this.fetchBundleData(name.name);
                }}
              >
                {name.name}
              </button>
            </li>
          )),
        });
      });
  }
  fetchBundleData(name) {
    fetch(
      `https://raw.githubusercontent.com/DBCG/connectathon/master/fhir401/bundles/` +
        name +
        `/` +
        name +
        `-bundle.json`
    )
      .then((response) => response.json())
      .then((data) => {
        const generator = new Generator(data);
        const moduleJSON = generator.generate();
        this.loadModule(JSON.stringify(moduleJSON));
      })
      .catch((error) => console.log("error: ", error));
  }
  fetchSubmodule(name) {
    fetch(
      `https://raw.githubusercontent.com/synthetichealth/synthea/` +
        this.state.currentBranch +
        `/src/main/resources/modules/` +
        this.state.currentModule +
        `/` +
        name
    )
      .then((response) => response.text())
      .then((data) => this.loadModule(data))
      .then(
        this.setState({
          Submodules: null,
          Modules: null,
        })
      )
      .catch((error) => console.log("error: ", error));
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.selectedOption === "git" &&
      prevState.selectedOption !== "git"
    ) {
      this.fetchBranchList();
    }
    if (
      this.state.selectedOption === "ecqm" &&
      prevState.selectedOption !== "ecqm"
    ) {
      this.fetchECQMBundles();
    }
  }

  renderWelcomeMessage = () => {
    if (this.props.welcome) {
      return (
        <div>
          Welcome to Synthea Module Builder. Please visit the documentation
          first.
        </div>
      );
    }

    return <div />;
  };

  render() {
    let classDetails = " hide",
      style = { display: "none" };

    if (this.props.visible) {
      classDetails = " show";
      style = { display: "block" };
    }

    return (
      <div>
        <div className={"modal " + classDetails} style={style}>
          <div
            className="modal-content"
            style={{
              width: "900px",
              marginLeft: "15%",
              marginRight: "15%",
              marginTop: 50,
            }}
          >
            <div className="modal-header">
              <h5 className="modal-title">
                {!this.props.welcome ? "Load Module" : "Synthea Module Builder"}
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={this.props.onHide}
                style={{ display: this.props.welcome ? "none" : "" }}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body LoadModule-body">
              <StyledDropzone onDrop={this.onDrop.bind(this)} />
              <div className="container">
                <div className="row">
                  <div className="col-3 nopadding">
                    <ul className="LoadModule-options">
                      <li
                        className={
                          this.state.selectedOption === "core" ? "selected" : ""
                        }
                      >
                        <button
                          className="btn btn-link"
                          onClick={this.onOptionClick("core")}
                        >
                          Core Modules
                        </button>
                      </li>
                      <li
                        className={
                          this.state.selectedOption === "submodules"
                            ? "selected"
                            : ""
                        }
                      >
                        <button
                          className="btn btn-link"
                          onClick={this.onOptionClick("submodules")}
                        >
                          Submodules
                        </button>
                      </li>
                      {Object.keys(this.props.modules).length > 0 ? (
                        <li
                          className={
                            this.state.selectedOption === "my" ? "selected" : ""
                          }
                        >
                          <button
                            className="btn btn-link"
                            onClick={this.onOptionClick("my")}
                          >
                            My Modules
                          </button>
                        </li>
                      ) : (
                        ""
                      )}
                      <li
                        className={
                          this.state.selectedOption === "json" ? "selected" : ""
                        }
                      >
                        <button
                          className="btn btn-link"
                          onClick={this.onOptionClick("json")}
                        >
                          Paste JSON
                        </button>
                      </li>
                      <li
                        className={
                          this.state.selectedOption === "git" ? "selected" : ""
                        }
                      >
                        <button
                          className="btn btn-link"
                          onClick={this.onOptionClick("git")}
                        >
                          GitHub Modules
                        </button>
                      </li>
                      <li
                        className={
                          this.state.selectedOption === "ecqm" ? "selected" : ""
                        }
                      >
                        <button
                          className="btn btn-link"
                          onClick={this.onOptionClick("ecqm")}
                        >
                          Generate From eCQM
                        </button>
                      </li>
                    </ul>
                  </div>
                  <div className="col-9 nopadding">{this.renderDetails()}</div>
                </div>
              </div>
            </div>
            {this.renderFooter()}
          </div>
        </div>
        <div className={`modal-backdrop ${classDetails}`} style={style} />
      </div>
    );
  }
}

export default LoadModule;
