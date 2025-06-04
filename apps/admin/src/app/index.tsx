import { c } from '@repo/contracts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { initTsrReactQuery } from '@ts-rest/react-query/v5';

const queryClient = new QueryClient();

export const tsr = initTsrReactQuery(c, {
	baseUrl: import.meta.env.VITE_API_BASE_URL,
	baseHeaders: {
		'x-app-source': 'ts-rest',
	},
});

export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<tsr.ReactQueryProvider>
				<div style={{ padding: '1rem' }}>
					<Example />
				</div>
			</tsr.ReactQueryProvider>
		</QueryClientProvider>
	);
}

function Example() {
	const { data, isPending, error } = tsr.restaurants.getAllRestaurants.useQuery(
		{
			queryKey: ['restaurants'],
		},
	);

	if (isPending) return 'Loading...';

	if (error) return `An error has occurred: ${error}`;

	return (
		<div>
			<h1>{data.body[0].name}</h1>
			<pre style={{ border: '1px solid #ccc', padding: '1rem' }}>
				{JSON.stringify(data, null, 2)}
			</pre>
		</div>
	);
}
