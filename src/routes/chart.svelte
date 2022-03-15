<script>
    import { onMount } from "svelte";
    import {
        LinkedChart,
        LinkedLabel,
        LinkedValue,
    } from "svelte-tiny-linked-charts";
    let transitioningData = fakeData(30);
    let transitionColor = 50;
    onMount(() => {
        setInterval(() => {
            transitioningData = fakeData(30);
            transitionColor = Math.floor(Math.random() * 360);
        }, 1000);
    });
    function fakeData(times, maxValue = 100, minValue = 50) {
        const data = {};
        const date = new Date("2005-05-01T00:00:00Z");
        for (let i = 0; i < times; i++) {
            const setDate = date.setDate(date.getDate() - 1);
            const formattedDate = new Date(setDate)
                .toISOString()
                .substring(0, 10);
            data[formattedDate] =
                Math.floor(Math.random() * (maxValue - minValue)) + minValue;
        }
        const reversedData = {};
        for (let i = 0; i < times; i++) {
            reversedData[Object.keys(data)[times - 1 - i]] =
                Object.values(data)[times - 1 - i];
        }
        return reversedData;
    }
</script>

<section>
    <div class="wrapper">
        <div class="header">
            <h1>Tiny Linked Charts for <mark>Svelte</mark></h1>
        </div>

        <div class="block block--single">
            <table class="preview-table">
                <tr>
                    <th>Name</th>
                    <th width="150"
                        ><LinkedLabel
                            linked="table"
                            empty="30 day period"
                        /></th
                    >
                    <th>Value</th>
                </tr>

                <tr>
                    <td class="label">A thing</td>
                    <td
                        ><LinkedChart
                            data={fakeData(30)}
                            linked="table"
                            uid="table-1"
                        /></td
                    >
                    <td
                        ><LinkedValue
                            uid="table-1"
                            empty={Object.values(fakeData(30)).reduce(
                                (a, b) => a + b
                            )}
                        /></td
                    >
                </tr>

                <tr>
                    <td class="label">Another thing</td>
                    <td
                        ><LinkedChart
                            data={fakeData(30)}
                            linked="table"
                            uid="table-2"
                        /></td
                    >
                    <td
                        ><LinkedValue
                            uid="table-2"
                            empty={Object.values(fakeData(30)).reduce(
                                (a, b) => a + b
                            )}
                        /></td
                    >
                </tr>

                <tr>
                    <td class="label">A third thing</td>
                    <td
                        ><LinkedChart
                            data={fakeData(30)}
                            linked="table"
                            uid="table-3"
                        /></td
                    >
                    <td
                        ><LinkedValue
                            uid="table-3"
                            empty={Object.values(fakeData(30)).reduce(
                                (a, b) => a + b
                            )}
                        /></td
                    >
                </tr>

                <tr>
                    <td class="label">An incomplete thing</td>
                    <td
                        ><LinkedChart
                            data={fakeData(15)}
                            linked="table"
                            uid="table-4"
                        /></td
                    >
                    <td
                        ><LinkedValue
                            uid="table-4"
                            empty={Object.values(fakeData(15)).reduce(
                                (a, b) => a + b
                            )}
                        /></td
                    >
                </tr>

                <tr>
                    <td class="label">A changing thing</td>
                    <td
                        ><LinkedChart
                            data={transitioningData}
                            linked="table"
                            uid="table-5"
                            transition="100"
                            fill="hsl({transitionColor}, 60%, 50%)"
                        /></td
                    >
                    <td
                        ><LinkedValue
                            uid="table-5"
                            empty={Object.values(transitioningData).reduce(
                                (a, b) => a + b
                            )}
                        /></td
                    >
                </tr>

                <tr>
                    <td class="label">A thing using lines</td>
                    <td
                        ><LinkedChart
                            data={fakeData(30)}
                            linked="table"
                            uid="table-6"
                            type="line"
                        /></td
                    >
                    <td
                        ><LinkedValue
                            uid="table-6"
                            empty={Object.values(fakeData(30)).reduce(
                                (a, b) => a + b
                            )}
                        /></td
                    >
                </tr>
            </table>
        </div>
    </div>
</section>

<style>
    section {
        width: 100%;
        display: flex;
        justify-content: center;
    }

    :global(:root) {
        --primary: #ff3e00;
        --text-color: #444;
        --text-color-light: #999;
        --border-color: #edf3f0;
        --bg-well: #f6fafd;
        --bg-body: #fff;
    }
    @media (prefers-color-scheme: dark) {
        :global(:root) {
            --text-color: #b7c0d1;
            --text-color-light: #8e99af;
            --border-color: #363d49;
            --bg-well: #21242c;
            --bg-body: #16181d;
        }
    }
    :global(body) {
        padding: 0;
        margin: 0;
        color: var(--text-color);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            "Helvetica Neue", Arial, "Noto Sans", sans-serif,
            "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
            "Noto Color Emoji";
    }
    h1 {
        margin: 0;
        color: white;
    }
    h2 {
        margin: 3rem 0 1.5rem;
        color: white;
    }
    code {
        display: block;
        margin-top: 1rem;
        color: var(--text-color-light);
        font-size: 0.75rem;
        line-height: 1.5em;
    }
    mark {
        background: none;
        color: var(--primary);
    }
    a {
        color: var(--primary);
    }
    p:first-child {
        margin-top: 0;
    }
    .well {
        padding: 0.35rem 0.5rem;
        border-radius: 0.5rem;
        border: 1px solid var(--border-color);
        background: var(--bg-well);
    }
    .header {
        margin: 6rem 0 0;
    }
    :global(.header svg) {
        width: 100%;
        height: 5px;
    }
    .wrapper {
        max-width: 540px;
        margin: 0 auto;
        padding: 0 1rem 6rem;
    }
    .block {
        padding: 3rem 0;
        border-bottom: 1px solid var(--border-color);
    }
    @media (min-width: 600px) {
        .block {
            display: grid;
            grid-template-columns: 1fr auto;
            grid-gap: 1.5rem;
            justify-content: space-between;
        }
    }
    .block--single {
        display: block;
    }
    .description {
        margin-bottom: 1rem;
    }
    @media (min-width: 600px) {
        .description {
            margin-bottom: 0;
        }
    }
    .table {
        display: grid;
        grid-template-columns: 1fr 1fr 3fr;
        grid-gap: 1rem 0.5rem;
    }
    .table strong {
        color: var(--text-color);
    }
    .table code {
        margin-top: 0;
        line-height: 1.3rem;
    }
    .chart {
        margin-top: 0.5rem;
    }
    :global(.chart--responsive svg) {
        width: 100%;
        height: auto;
    }
    table {
        width: 100%;
        border: 1px solid var(--border-color);
        border-radius: 0.5rem;
        border-collapse: collapse;
        background: var(--bg-well);
        font-size: clamp(0.75rem, 3vw, 1rem);
        color: var(--text-color-light);
        font-style: italic;
    }
    table tr:nth-child(even) td {
        background: var(--bg-body);
    }
    table tr td,
    table tr th {
        border: 0;
        padding: 0.5rem 0 0.5rem 1rem;
        text-align: left;
    }
    table :global(svg) {
        max-width: 100%;
        height: auto;
    }
    table .label {
        color: var(--text-color);
        font-style: normal;
    }
</style>
