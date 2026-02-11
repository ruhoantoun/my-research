import React, { Component } from "react";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { createUserDescription } from "../../services/userServices";
import { getAllUsers } from "../../services/userServices";
import { getAllCodes } from "../../services/userServices";
import { languages } from "../../utils/constant";
import * as actions from "../../../src/store/actions";
import Select from "react-select";

const mdParser = new MarkdownIt();

class UserDescription extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contentMarkdown: "",
            contentHTML: "",
            description: "",
            selectedPosition: null,
            selectedUser: null,
            image: "",
            positions: [],
            users: []
        };
    }
    async componentDidMount() {
        try {
            const response = await getAllUsers();
            console.log("API Response:", response); // Kiểm tra response
    
            if (response && response.data && response.data.errCode === 0) {
                const users = response.data.data;
                console.log("Users data:", users); // Kiểm tra data
                
                this.setState({
                    users: this.buildSelectOptions(users)
                });
            } else {
                toast.error("Failed to fetch event types");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Error loading data");
        }
    }

    buildSelectOptions = (items) => {
        return items.map(item => ({
            value: item.id,
            label: `${item.firstName} ${item.lastName || ''}`.trim()// Trim whitespace
        }));
    };

    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentMarkdown: text,
            contentHTML: html
        });
    };
    handleImageChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            this.setState({ image: reader.result });
        };
    };

    handleSaveContent = async () => {
        const { contentHTML, contentMarkdown, description, 
                 selectedUser, image } = this.state;

        if (!selectedUser) {
            toast.error("Please select an event");
            return;
        }
        console.log("check state", this.state)

        try {
            const response = await createUserDescription({
                contentHTML,
                contentMarkdown,
                description,
                userId: selectedUser.value,
                image
            });

            if (response && response.data.errCode === 0) {
                toast.success("Save description successfully!");
                this.setState({
                    contentMarkdown: "",
                    contentHTML: "",
                    description: "",
                    selectedPosition: null,
                    selectedUser: null,
                    image: ""
                });
            } else {
                toast.error(response.data.errMessage);
            }
        } catch (error) {
            console.error("Error saving content:", error);
            toast.error("Error saving content");
        }
    };
    render() {
        console.log("check state", this.state)
        const { selectedUser, users } = this.state;

        return (
            <div className="event-description-container p-4">
                <h2 className="text-center mb-4">User Description Editor</h2>
                
                <div className="row mb-4">
                    <div className="col-md-6">
                        <label className="form-label">users:</label>
                        <Select
                            value={selectedUser}
                            onChange={(option) => this.setState({ selectedUser: option })}
                            options={users}
                            className="basic-select"
                            placeholder="Select users"
                            isSearchable={true}
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="form-label">Short Description:</label>
                    <textarea
                        className="form-control"
                        rows="3"
                        value={this.state.description}
                        onChange={(e) => this.setState({ description: e.target.value })}
                    ></textarea>
                </div>

                <div className="mb-4">
                    <label className="form-label">Featured Image:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={this.state.image}
                        accept="image/*"
                        onChange={(e) => this.setState({ image: e.target.value })}
                    />
                </div>

                <div className="markdown-editor mb-4">
                    <label className="form-label">Detailed Description:</label>
                    <MdEditor
                        style={{ height: "500px" }}
                        renderHTML={(text) => mdParser.render(text)}
                        onChange={this.handleEditorChange}
                        value={this.state.contentMarkdown}
                    />
                </div>

                <button
                    className="btn btn-primary"
                    onClick={this.handleSaveContent}
                >
                    Save Description
                </button>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    language: state.app.language
});

export default connect(mapStateToProps)(UserDescription);