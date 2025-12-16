import scenario from "@langwatch/scenario";
import { describe, it, expect } from "vitest";
import { basicAgent } from "./agent-adapter.spec";

describe("Weather Station RAG Agent", () => {
    it("should provide accurate calibration instructions", async () => {
        const result = await scenario.run({
            name: "barometric pressure calibration request",
            description: `The user needs help calibrating their Vantage Pro2 weather station's barometric pressure sensor.`,
            agents: [
                basicAgent,
                scenario.userSimulatorAgent(),
                scenario.judgeAgent({
                    criteria: [
                        "Agent should provide calibration steps directly without asking follow-up questions",
                        "Response should include step-by-step instructions",
                        "Response should cite the Vantage Pro2 Operations Manual as source",
                        "Response should use telegraphic style (imperative verbs, minimal articles)",
                        "Agent should not include greetings or filler text",
                        "Instructions should mention setting correct elevation first",
                    ],
                }),
            ],
            script: [
                scenario.user("How do I calibrate pressure?"),
                scenario.agent(),
                scenario.judge(),
            ],
        });

        expect(result.success).toBe(true);
    }, 30_000);

    it("should use weatherTool for temperature and humidity requests", async () => {
        const result = await scenario.run({
            name: "current weather data request",
            description: `The user wants current temperature and humidity readings.`,
            agents: [
                basicAgent,
                scenario.userSimulatorAgent(),
                scenario.judgeAgent({
                    criteria: [
                        "Agent should use the weatherTool to fetch current weather data",
                        "Agent should respond with 'Here's the weather data that you requested'",
                        "Agent should not ask follow-up questions",
                    ],
                }),
            ],
            script: [
                scenario.user("What's the current temperature and humidity?"),
                scenario.agent(),
                scenario.user("Station ID is TEST123009"),
                scenario.agent(),
                scenario.judge(),
            ],
        });

        expect(result.success).toBe(true);
    }, 30_000);

    it("should use dataTool for soil moisture requests", async () => {
        const result = await scenario.run({
            name: "soil moisture data request",
            description: `The user wants current soil moisture data from their weather station.`,
            agents: [
                basicAgent,
                scenario.userSimulatorAgent(),
                scenario.judgeAgent({
                    criteria: [
                        "Agent should request for Station ID",
                        "Agent should use the dataTool to fetch soil moisture data",
                        "Agent should respond with 'Here's the soil moisture data that you requested'",
                        "Agent should not provide additional explanation beyond tool usage",
                    ],
                }),
            ],
            script: [
                scenario.user("Show me current soil moisture levels"),
                scenario.agent(),
                scenario.user("Station ID is TEST123009"),
                scenario.agent(),
                scenario.judge(),
            ],
        });

        expect(result.success).toBe(true);
    }, 30_000);

    it("should use gddTool for growing degree day requests", async () => {
        const result = await scenario.run({
            name: "gdd data request",
            description: `The user wants current growing degree day data from their weather station.`,
            agents: [
                basicAgent,
                scenario.userSimulatorAgent(),
                scenario.judgeAgent({
                    criteria: [
                        "Agent should request for Station ID",
                        "Agent should use the gddTool to fetch growing degree day data",
                        "Agent should respond with 'Here's the growing degree day data that you requested'",
                        "Agent should not provide additional explanation beyond tool usage",
                    ],
                }),
            ],
            script: [
                scenario.user("Show me current GDD data"),
                scenario.agent(),
                scenario.user("Station ID is TEST123009"),
                scenario.agent(),
                scenario.judge(),
            ],
        });

        expect(result.success).toBe(true);
    }, 30_000);
});