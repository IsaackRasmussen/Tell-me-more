# Tell me more!
This is not yet a functional project. The website can list feeds and episodes from the Databricks cluster that might not be available by the time you read this. There are some cached JSON responses for that purpose.

I'll share what I've learned instead.

## Goal/Dreams for Tell me more!
To improve searching for new podcasts. Simple keywords searches is not enough, I want to add more context.
And that can be by identifying podcast speakers and topics, this is now something AI is becoming increasingly good at.

## Transcripts
There already exist Podcast services that are doing podcast transcripts. However, they are not available through their API's.
It is likely due to copyright issues. For that reason, I've focused on podcasts with Creative Common's licenses while I investigate this further.

To transcribe audio, there are different engines. I only got to try Whisper and with the Insanely-Fast-Whisper version. It works on CUDA GPU's and Apple Silicon.
After processing, you get a JSON file with the transcripts in segments, you need to do an additional step to figure out who is saying what.

## Diarization "Dia-... what?" **
Insanely-Fast-Whisper has builtin support for Pyannote and you only need to supply a HuggingFace token. Its free! And a recommendation for you to go checkout [Hugging Face](https://huggingface.co/), which is an amazing resourcse for AI.

While Pyannote appears to work really well, it does not really do voice biometrics out of the box, so an additional step is needed.
The biometrics are needed to be able to recognize the speaker again in a different audio setting. What Pyannote does is to list the different speakers but not their signature.

## Voice biometrics
This is not yet as easy as transcribing. But I found [Picovoice](https://picovoice.ai/platform/eagle/) that also offers an API. I have yet to try it myself.
