const express = require("express");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 5000;

// Allow cross-origin requests for frontend
const cors = require('cors');
app.use(cors());

// Path to yt-dlp.exe (adjust this if it's in a different location)
const ytDlpPath = "C:\\Users\\pompk\\Downloads\\yt-dlp.exe";

app.get("/download", async (req, res) => {
    const videoUrl = req.query.url;

    if (!videoUrl) {
        return res.status(400).send("You must provide a video URL.");
    }

    const outputPath = path.join(__dirname, "downloads", "audio.mp3");

    // Ensure the directory exists
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });

    try {
        // Run yt-dlp.exe from the command line to download and convert video
        exec(`"${ytDlpPath}" -x --audio-format mp3 -o "${outputPath}" "${videoUrl}"`, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                console.error(`stderr: ${stderr}`);
                return res.status(500).send(`Error: ${stderr}`);
            }

            console.log(`stdout: ${stdout}`);

            // Send the MP3 file as a response
            res.download(outputPath, "audio.mp3", (err) => {
                if (err) {
                    console.log("Error in file download:", err);
                }

                // Cleanup after download
                fs.unlinkSync(outputPath);
            });
        });
    } catch (error) {
        console.error("Error during download:", error);
        res.status(500).send("Error downloading the video.");
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
