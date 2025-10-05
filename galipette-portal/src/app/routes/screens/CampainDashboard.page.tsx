import { Link } from 'react-router-dom';
// If a CAMPAIGN_MANAGEMENT entry is added to PAGES, you would import it like this:
// import { PAGES } from '@/app/routes/config/pages';

/**
 * CampaignDashboardPage - An example page displaying an overview of campaigns.
 * It lists dummy campaigns and provides links to their individual management pages.
 */
export default function CampaignDashboardPage() {
  // Dummy data for campaigns
  const campaigns = [
    { id: '1', name: "The Dragon's Hoard" },
    { id: '2', name: 'Mystery of the Whispering Woods' },
    { id: '3', name: 'Siege of the Obsidian Tower' },
    { id: '4', name: 'The Sunken City of Eldoria' },
  ];

  return (
    <section className="container mx-auto p-6">
      <h1 className="text-2xl font-bold">Campaign Dashboard</h1>
      <p className="text-sm mt-2 text-muted-foreground">
        Welcome to your campaign hub. Select a campaign to manage its details.
      </p>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Your Active Campaigns</h2>
        {campaigns.length === 0 ? (
          <p className="text-gray-600">
            You don't have any campaigns yet. Why not create one?
          </p>
        ) : (
          <ul className="space-y-4">
            {campaigns.map(campaign => (
              <li
                key={campaign.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow duration-200"
              >
                <span className="text-lg font-medium text-gray-800">
                  {campaign.name}
                </span>
                <Link
                  // Assuming the route for campaign management is '/campaigns/:campaignId'
                  // If PAGES had a CAMPAIGN_MANAGEMENT entry with a build function, it would be:
                  // to={PAGES.CAMPAIGN_MANAGEMENT.build({ campaignId: campaign.id })}
                  to={`/campaigns/${campaign.id}`}
                  className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                >
                  Manage Campaign &rarr;
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-10 pt-6 border-t border-gray-200">
        <Link
          to="/campaigns/new" // Placeholder for a "create new campaign" page
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          + Create New Campaign
        </Link>
      </div>
    </section>
  );
}
