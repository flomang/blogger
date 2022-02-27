<script context="module" lang="ts">
    import { InlineCalendar } from "svelte-calendar";
    import dayjs from "dayjs";

    export const prerender = true;

    const theme = {
        calendar: {
            width: "600px",
            shadow: "0px 0px 30px rgba(0.0, 0.0, 0.0, .3)",
            colors: {
                background: {
                    highlight: "#333",
                },
            },
        },
    };
</script>

<script lang="ts">
    import Counter from "$lib/Counter.svelte";
    import { onMount } from "svelte";
    import SunCalc from "suncalc";
    import moment from "moment";

    let today = new Date();
    today.setHours(0);

    let store;
    let count = 0;

    // update count if calendar was selected
    $: if ($store?.selected) {
        let selected = $store?.selected;

        let next = selected.getTime();
        let prev = today.getTime();

        let delta = Math.round((next - prev) / 86400000);
        count = delta;
        planet_hours(selected);

        moon = SunCalc.getMoonIllumination(selected);
    }

    function toLocalTime(time: Date): Date {
        var offset = (new Date().getTimezoneOffset() / 60) * -1;
        var n = new Date(time.getTime() + offset);
        return n;
    }

    let days = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
    let chaldean = [
        "Saturn",
        "Jupiter",
        "Mars",
        "Sun",
        "Venus",
        "Mercury",
        "Moon",
    ];
    let latitude;
    let longitude;
    let dayHours = [];
    let nightHours = [];
    let moon;

    function moon_phase(phase: number): string {
        if (phase == 0.0) {
            return "New Moon";
        } else if (phase > 0.0 && phase < 0.25) {
            return "Waxing Cresent";
        } else if (phase == 0.25) {
            return "First Quarter";
        } else if (phase > 0.25 && phase < 0.5) {
            return "Waxing Gibbous";
        } else if (phase == 0.5) {
            return "Full Moon";
        } else if (phase > 0.5 && phase < 0.75) {
            return "Waning Gibbous";
        } else if (phase == 0.75) {
            return "Last Quarter";
        } else if (phase > 0.75) {
            return "Waning Cresent";
        }
        return "N/A";
    }

    function planet_hours(date: Date) {
        let nextDay = new Date();
        nextDay.setDate(date.getDate() + 1);
        date.setMinutes(nextDay.getMinutes());

        let suncalc1 = SunCalc.getTimes(date, latitude, longitude);
        let suncalc2 = SunCalc.getTimes(nextDay, latitude, longitude);

        let sunrise = suncalc1.sunrise;
        let sunset = suncalc1.sunset;
        let sunrise2 = suncalc2.sunrise;

        let daylight_milliseconds = sunset.getTime() - sunrise.getTime();
        let daylight_milliseconds_hour = daylight_milliseconds / 12;

        let night_milliseconds = sunrise2.getTime() - sunset.getTime();
        let night_milliseconds_hour = night_milliseconds / 12;

        let ruler = days[date.getDay()];
        let index = chaldean.findIndex(function (c) {
            return ruler == c;
        });

        var sunriseMls = sunrise.getTime();
        var sunsetMls = sunset.getTime();

        let dayHrs = [];
        let nightHrs = [];

        for (let hour = 0; hour < 12; ++hour) {
            var i = (index + hour) % 7;

            dayHrs.push({
                hour: hour + 1,
                ruler: chaldean[i],
                start: new Date(sunriseMls + daylight_milliseconds_hour * hour),
                end: new Date(
                    sunriseMls + daylight_milliseconds_hour * (hour + 1)
                ),
            });

            i = (i + 12) % 7;

            nightHrs.push({
                hour: hour + 13,
                ruler: chaldean[i],
                start: new Date(sunsetMls + night_milliseconds_hour * hour),
                end: new Date(sunsetMls + night_milliseconds_hour * (hour + 1)),
            });
        }
        dayHours = [];
        nightHours = [];
        dayHours = dayHrs;
        nightHours = nightHrs;
    }

    onMount(async () => {
        navigator.geolocation.getCurrentPosition(function (position) {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;

            if ($store?.selected) {
                planet_hours($store?.selected);
            }
        });
    });
</script>

<svelte:head>
    <title>Home</title>
</svelte:head>

<section>
    <div class="calendar">
        <InlineCalendar bind:store {theme} start={today} />

        <div class="grid">
            <button on:click={() => store.add(-1, "year")}>-1y</button>
            <button on:click={() => store.add(-1, "month")}>-1m</button>
            <button on:click={() => store.add(-1, "week")}>-1w</button>
            <p class="date">
                {dayjs($store?.selected).format("MM/DD/YYYY")}
            </p>
            <button on:click={() => store.add(1, "week")}>1w</button>
            <button on:click={() => store.add(1, "month")}>+1m</button>
            <button on:click={() => store.add(1, "year")}>+1y</button>
        </div>

        <Counter bind:count bind:store />
    </div>
    <div class="hours">
        {#if moon != undefined}
            <div class="moon">
                <h3>Moon</h3>
                <div>Illuminated: {(moon.fraction * 100).toFixed(2)} %</div>
                <div>Phase: {moon_phase(moon.phase)}</div>
                <div>Angle: {moon.angle}</div>
            </div>
        {/if}
        <div class="day">
            <h3>Day</h3>
            {#each dayHours as hour, index (hour.hour)}
                <div>
                    ({("0" + hour.hour).slice(-2)})
                    {moment(hour.start).format("hh:mm:ss A")} - {moment(
                        hour.end
                    ).format("hh:mm:ss A")}
                    <b>{hour.ruler}</b>
                </div>
            {/each}
        </div>
        <div class="night">
            <h3>Night</h3>
            {#each nightHours as hour, index (hour.hour)}
                <div>
                    ({("0" + hour.hour).slice(-2)})
                    {moment(hour.start).format("hh:mm:ss A")} - {moment(
                        hour.end
                    ).format("hh:mm:ss A")}
                    <b>{hour.ruler}</b>
                </div>
            {/each}
        </div>
    </div>
</section>

<style>
    section {
        width: 100%;
        display: flex;
        justify-content: center;
    }

    .calendar {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        float: left;
    }

    .hours {
        padding: 0 15px;
    }

    h3 {
        justify-content: center;
        display: flex;
        width: 100%;
    }

    .welcome {
        position: relative;
        width: 100%;
        height: 0;
        padding: 0 0 calc(100% * 495 / 2048) 0;
    }

    .grid {
        background: #333;
        color: #fff;
        display: grid;
        grid-template-columns: auto auto auto 1fr auto auto auto;
        text-align: center;
        align-items: center;
        width: 600px;
    }

    .date {
        color: #fff;
        font-size: 1.3em;
    }

    button {
        background: #5829d6;
        padding: 23px 20px;
        color: #fff;
        font-size: 1.3em;
        border-radius: 1px;
        border: 0;
        box-shadow: 4px 3px 9px rgb(0 0 0 / 20%);
        cursor: pointer;
    }
</style>
