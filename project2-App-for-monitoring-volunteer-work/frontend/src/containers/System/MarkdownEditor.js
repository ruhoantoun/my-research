import React, { Component } from "react";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { createMarkdown } from "../../services/userServices";
import { languages } from "../../utils/constant";
import * as actions from "../../../src/store/actions";
import Select from 'react-select';

const mdParser = new MarkdownIt();

class MarkdownEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contentMarkdown: "",
            contentHTML: "",
            description: "",
            doctorId: "",
            hasData: false,
            selectedDoctor: null,
        };
    }

    componentDidMount() {
        this.props.fetchAllDoctors();
    }

    buildDoctorOptions = (doctors) => {
        return doctors.map((doctor) => ({
            value: doctor.id,
            label:
                this.props.language === languages.VI
                    ? `${doctor.lastName} ${doctor.firstName}`
                    : `${doctor.firstName} ${doctor.lastName}`,
        }));
    };

    handleDoctorSelect = (selectedOption) => {
        this.setState({ selectedDoctor: selectedOption });
    };
    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentMarkdown: text,
            contentHTML: html,
        });
    };
    handleSaveContent = async () => {
        console.log("check state", this.state);

        try {
            let response = await createMarkdown({
                contentHTML: this.state.contentHTML,
                contentMarkdown: this.state.contentMarkdown,
                description: this.state.description,
                doctorId: this.state.selectedDoctor.value,
            });
            console.log("check response", response);
            if (response && response.data.errCode === 0) {
                toast.success("Save content succeed!");
            } else {
                toast.error(response.errMessage);
            }
        } catch (e) {
            console.log(e);
            toast.error("Error saving content");
        }
    };
    render() {
        const { isLoading, allDoctors, language } = this.props;
        console.log("check state", this.state);
        const { selectedDoctor } = this.state;
        return (
            <div className="markdown-editor-container">
                <div className="select-doctor mb-3 col-6">
                    <label className="form-label">Select Doctor:</label>
                    <Select
                        value={selectedDoctor}
                        onChange={this.handleDoctorSelect}
                        options={this.buildDoctorOptions(allDoctors)}
                        className="basic-select"
                        classNamePrefix="select"
                        placeholder={
                            language === languages.VI
                                ? "Chọn bác sĩ"
                                : "Select doctor"
                        }
                        isSearchable={true}
                        isLoading={isLoading}
                    />
                </div>
                <div class="description-input mt-3 col-6">
                    <label for="exampleFormControlTextarea1" class="form-label">
                        Description:
                    </label>
                    <textarea
                        class="form-control"
                        rows="3"
                        value={this.state.description}
                        onChange={(e) =>
                            this.setState({ description: e.target.value })
                        }
                    ></textarea>
                </div>
                <div className="markdown-editor">
                    <MdEditor
                        style={{ height: "500px" }}
                        renderHTML={(text) => mdParser.render(text)}
                        onChange={this.handleEditorChange}
                        value={this.state.contentMarkdown}
                    />
                </div>


                <button
                    className="btn btn-primary mt-3"
                    onClick={this.handleSaveContent}
                >
                    Save Content
                </button>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        isLoggedIn: state.user.isLoggedIn,
        allDoctors: state.admin.allDoctors,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MarkdownEditor);
