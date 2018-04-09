require("dotenv").load();
const github = require("@octokit/rest");

function getGithubFile(path){
    return github.repos.getContent(
        process.env.GITHUB_USERNAME,
        process.env.GITHUB_REPO,
        path
    );
}

function getExample(example){
    return getGithubFile(`routes/${example}.js`);
}

module.exports = {
    getGithubFile,
    getExample
};
