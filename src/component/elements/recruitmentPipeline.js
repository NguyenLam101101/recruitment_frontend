import "../../css/recruitmentPipeline.css";

export default function RecruitmentPipeline(props) {
    return (
        <div className="recruitment-pipeline">
            <div className="recruitment-pipeline-phases">
                {
                    props.mails.map(mail =>
                        <div className={"recruitment-pipeline-phase " + mail.status}>
                            <div className="pipeline-phase-name">{mail.phase}</div>
                        </div>
                    )
                }
            </div>
            <div className="recruitment-pipeline-statuses">
                <div className="recruitment-pipeline-status-item">
                    <div className="recruitment-pipeline-status status--passed"></div>
                    <div className="recruitment-pipeline-status-name">passed</div>
                </div>
                <div className="recruitment-pipeline-status-item">
                    <div className="recruitment-pipeline-status status--failed"></div>
                    <div className="recruitment-pipeline-status-name">failed</div>
                </div>
                <div className="recruitment-pipeline-status-item">
                    <div className="recruitment-pipeline-status status--processing"></div>
                    <div className="recruitment-pipeline-status-name">processing</div>
                </div>
                <div className="recruitment-pipeline-status-item">
                    <div className="recruitment-pipeline-status status--done"></div>
                    <div className="recruitment-pipeline-status-name">done</div>
                </div>
                {/* <div className="recruitment-pipeline-status-item">
                    <div className="recruitment-pipeline-status status--not-happen"></div>
                    <div className="recruitment-pipeline-status-name">not happen</div>
                </div> */}
            </div>
        </div>
    )
}