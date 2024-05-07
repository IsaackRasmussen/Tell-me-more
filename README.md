# Tell me more!
This is not yet a functional project. The website can list feeds and episodes from the Databricks cluster that might not be available by the time you read this. There are some cached JSON responses for that purpose.

I'll share what I've learned instead.

## Goal/Dreams for Tell me more!
To improve searching for new podcasts. Simple keywords searches is not enough, I want to add more context.
And that can be by identifying podcast speakers and topics, this is now something AI is becoming increasingly good at.

## Transcripts
There is Podcast services out there that are doing podcast transcripts. However, the transcripts are not available through their API's.
And it is likely due to copyright issues. For that reason, I've focused on podcasts with Creative Common's licenses, while I investigate this issue further.

To transcribe audio, there are different engines. I only got to try Whisper and with the Insanely-Fast-Whisper version. It works on CUDA GPU's and Apple Silicon.
After processing, you get a JSON file with the transcripts in segments, you need to do an additional step to figure out who is saying what.

## Diarization "Dia-... what?" **
Insanely-Fast-Whisper has builtin support for Pyannote and you only need to supply a HuggingFace token. Its free! And a recommendation for you to go checkout [Hugging Face](https://huggingface.co/), which is an amazing resourcse for AI.

While Pyannote appears to work really well, it does not really do voice biometrics out of the box, so an additional step is needed.
The biometrics are needed to be able to recognize the speaker again in a different audio setting. What Pyannote does is to list the different speakers but not their signature.

Pyanote is completely free but it appears to be less precise than Falcon from Picovoice. You can test their tools for free for up to 5 hours a month per tool and processing happens locally.
Picovoice also appears to be faster.

## Voice biometrics
This is not yet as easy as transcribing. But I'm currently testing out Eagle from Picovoice, I would like to find a completely free solution.

## Docker images
To build the docker images and run them
### Backend
docker build -t tell-me-more/backend .
docker run --rm -it -p 3001:3001 -e DATABRICKS_SERVER_HOSTNAME="{your_cluster_hostname_}.databricks.com" -e DATABRICKS_HTTP_PATH="/sql/1.0/warehouses/{your_sqlwarehouse_id}" -e DATABRICKS_TOKEN={your_token} tell-me-more/backend

### Frontend
docker build -t tell-me-more/frontend .
docker run --rm -it -p 5173:5173 -e VITE_SERVER_URL="http://{local_ip_address}:3001" tell-me-more/frontend
