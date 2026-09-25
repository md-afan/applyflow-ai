import Link from "next/link";

const features = [
	{
		number: "01",
		title: "Application Tracking",
		text: "Keep roles, companies, application status, key dates, and notes together in one workspace.",
	},
	{
		number: "02",
		title: "AI Job Analysis",
		text: "Compare a saved job description with your skills to see matches, gaps, and an AI summary.",
	},
	{
		number: "03",
		title: "Interview Tracking",
		text: "Schedule interview events and keep their dates, types, and notes beside each application.",
	},
	{
		number: "04",
		title: "Smart Reminders",
		text: "Create follow-up and deadline reminders, then review them alongside the related role.",
	},
	{
		number: "05",
		title: "Dashboard Analytics",
		text: "See application totals by status and keep upcoming deadlines in view at a glance.",
	},
	{
		number: "06",
		title: "PDF Reports",
		text: "Generate a downloadable progress report with status totals, role details, and dates.",
	},
];

const steps = [
	["01", "Sign up", "Create your personal workspace."],
	["02", "Add an application", "Save the role, company, and job details."],
	["03", "Analyze the job", "Compare the description with your saved skills."],
	["04", "Track interviews & reminders", "Keep conversations and follow-ups attached to the role."],
	["05", "Monitor progress", "Review statuses, deadlines, and export a PDF report."],
];

const technologies = [
	["Frontend", "Next.js", "React", "Tailwind CSS"],
	["Backend", "Node.js", "Express"],
	["Data & auth", "Supabase"],
	["AI", "OpenRouter"],
	["Workflows", "Inngest"],
	["PDF generation", "Playwright"],
];

export default function HomePage() {
	return (
		<main className="landing-page">
			<section className="landing-hero landing-container" aria-labelledby="home-title">
				<div className="landing-hero-copy">
					<p className="landing-eyebrow"><span className="landing-eyebrow-mark" /> YOUR JOB SEARCH, IN FLOW</p>
					<h1 id="home-title">A clearer path from <span>application</span> to offer.</h1>
					<p className="landing-hero-description">
						ApplyFlow AI brings your applications, job analysis, interviews, and follow-ups into one focused workspace, so the next step is always clear.
					</p>
					<div className="landing-hero-actions">
						<Link href="/signup" className="btn btn-primary landing-primary-cta">Get Started</Link>
						<a href="#features" className="landing-secondary-cta">Explore Features <span aria-hidden="true">↓</span></a>
					</div>
					<p className="landing-hero-note">For internships, your first role, and every move after.</p>
				</div>

				<div className="product-preview" aria-label="Illustrative preview of the ApplyFlow AI application dashboard">
					<div className="preview-window-bar">
						<div className="preview-window-dots" aria-hidden="true"><span /><span /><span /></div>
						<span className="preview-window-title">ApplyFlow AI <span>/</span> Overview</span>
						<span className="preview-label">SAMPLE WORKSPACE</span>
					</div>
					<div className="preview-layout">
						<aside className="preview-sidebar" aria-hidden="true">
							<div className="preview-sidebar-brand"><span className="preview-brand-mark">A</span><span>ApplyFlow</span></div>
							<div className="preview-side-item preview-side-item-active"><span className="preview-side-square" /> Overview</div>
							<div className="preview-side-item"><span className="preview-side-square" /> Applications</div>
							<div className="preview-side-item"><span className="preview-side-square" /> Reports</div>
							<div className="preview-profile"><span>JD</span><div><strong>Job seeker</strong><small>Workspace</small></div></div>
						</aside>
						<div className="preview-main">
							<div className="preview-heading-row">
								<div><p className="preview-kicker">OVERVIEW</p><h2>Application Dashboard</h2></div>
								<span className="preview-date">Your progress</span>
							</div>
							<div className="preview-metrics">
								<div className="preview-metric"><span>Total applications</span><strong>12</strong><small>Across your search</small></div>
								<div className="preview-metric"><span>Interviews</span><strong>03</strong><small>In your schedule</small></div>
								<div className="preview-metric"><span>Upcoming deadlines</span><strong>02</strong><small>Keep them in view</small></div>
							</div>
							<div className="preview-list-heading"><div><strong>Recent applications</strong><span>Example entries</span></div><span className="preview-list-link">View all</span></div>
							<div className="preview-application-row">
								<span className="preview-company-mark preview-company-mark-one">N</span>
								<div className="preview-application-name"><strong>Product Designer</strong><span>Northstar Studio</span></div>
								<span className="preview-status preview-status-interview">Interview</span>
								<span className="preview-row-date">Jun 18</span>
							</div>
							<div className="preview-application-row">
								<span className="preview-company-mark preview-company-mark-two">F</span>
								<div className="preview-application-name"><strong>UX Research Intern</strong><span>Fieldwork Labs</span></div>
								<span className="preview-status preview-status-applied">Applied</span>
								<span className="preview-row-date">Jun 14</span>
							</div>
							<div className="preview-bottom-note"><span className="preview-note-dot" /> Applications, interviews, and deadlines in one view</div>
						</div>
					</div>
				</div>
			</section>

			<section className="landing-section landing-container" id="features" aria-labelledby="features-title">
				<div className="landing-section-heading">
					<div><p className="landing-section-kicker">ONE WORKSPACE, LESS SPINNING PLATES</p><h2 id="features-title">Everything around the application.</h2></div>
					<p>Keep the details organized from the first saved role through the final follow-up.</p>
				</div>
				<div className="feature-grid">
					{features.map((feature) => (
						<article className="feature-card" key={feature.number}>
							<span className="feature-number">{feature.number}</span>
							<h3>{feature.title}</h3>
							<p>{feature.text}</p>
						</article>
					))}
				</div>
			</section>

			<section className="landing-workflow-section" id="how-it-works" aria-labelledby="workflow-title">
				<div className="landing-container">
					<div className="landing-section-heading">
						<div><p className="landing-section-kicker">A SIMPLE, REPEATABLE RHYTHM</p><h2 id="workflow-title">From saved role to clear next step.</h2></div>
						<p>Your job search stays connected as each opportunity moves forward.</p>
					</div>
					<ol className="workflow-list">
						{steps.map(([number, title, text]) => (
							<li className="workflow-step" key={number}>
								<span className="workflow-step-number">{number}</span>
								<h3>{title}</h3>
								<p>{text}</p>
							</li>
						))}
					</ol>
				</div>
			</section>

			<section className="landing-section landing-container" id="technology" aria-labelledby="technology-title">
				<div className="landing-section-heading">
					<div><p className="landing-section-kicker">BUILT WITH A PRACTICAL STACK</p><h2 id="technology-title">The tools behind the workflow.</h2></div>
					<p>A modern JavaScript app, with managed data, AI analysis, and scheduled background work.</p>
				</div>
				<div className="technology-list">
					{technologies.map(([category, ...tools]) => (
						<div className="technology-row" key={category}>
							<h3>{category}</h3>
							<div className="technology-tags">{tools.map((tool) => <span className="technology-tag" key={tool}>{tool}</span>)}</div>
						</div>
					))}
				</div>
			</section>

			<section className="landing-about-section" id="about-project" aria-labelledby="about-title">
				<div className="landing-container landing-about-inner">
					<div><p className="landing-section-kicker">ABOUT THE PROJECT</p><h2 id="about-title">A little more calm in a busy search.</h2></div>
					<div className="landing-about-copy">
						<p>ApplyFlow AI is an application tracker for students, interns, and active job seekers juggling multiple opportunities. It keeps role details, interview plans, reminders, and progress reports together, with AI job analysis to help you compare a role against your saved skills.</p>
						<Link href="/signup" className="landing-about-link">Start organizing your search <span aria-hidden="true">→</span></Link>
					</div>
				</div>
			</section>

			<footer className="landing-footer landing-container">
				<Link href="/" className="landing-footer-brand"><span className="brand-mark">A</span> ApplyFlow AI</Link>
				<span>Keep your next move in view.</span>
				<Link href="/login">Log in</Link>
			</footer>
		</main>
	);
}
