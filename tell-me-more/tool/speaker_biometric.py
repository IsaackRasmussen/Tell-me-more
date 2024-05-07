import pveagle
from pydub import AudioSegment
import json
import base64
import hashlib
import pvfalcon


sourceId = 69
sourcePath = f"/Media"
access_key = "$PVToken"
eagle_profiler = pveagle.create_profiler(access_key)
print(f"Eagle Sample: {eagle_profiler.sample_rate}")

#for segment in segments:
#    print("{speaker tag=%d - start_sec=%.2f end_sec=%.2f}" 
#          % (segment.speaker_tag, segment.start_sec, segment.end_sec))
    
jsonPodcast = {}
with open(f'{sourcePath}\{sourceId}.json') as filePodcast:
    jsonPodcast = json.load(filePodcast)

jsonProfiles = {}
with open('./profiles.json') as fileProfiles:
    try:
        jsonProfiles = json.load(fileProfiles)
    except json.JSONDecodeError as e:
        print("Creating new profile file")
        jsonProfiles["Profiles"] = []

handle = pvfalcon.create(access_key=access_key)
print(f"Falcon processing file: {sourcePath}\{sourceId}.mp3")
segments = handle.process_file(f'{sourcePath}\{sourceId}.mp3')

podcastAudio = AudioSegment.from_mp3(f"{sourcePath}\{sourceId}.mp3")

speakerIndex =1
while next(
                (item for item in jsonPodcast['speakers'] if item['speaker'] == f"SPEAKER_{str(speakerIndex).zfill(2)}"), None
            ):
    hashSha256 = hashlib.new('sha256')
    speakerIndexStr = f"SPEAKER_{str(speakerIndex).zfill(2)}"
    print(f"Profiling: {speakerIndexStr}")
    
    eagle_profiler.reset()
    percentage = 0
    speakerSegments = 0   
    for seg in segments:
        if (seg.speaker_tag==speakerIndex) and (percentage<100):
            segStart = int(seg.start_sec*1000)
            segEnd = int(seg.end_sec*1000)
            podcastSegment = podcastAudio[segStart:segEnd].set_frame_rate(eagle_profiler.sample_rate)
            print(f"Segment samplerate {podcastSegment.frame_rate}")
            #podcastSegment.export(f"{sourceId}_{speakerIndexStr}_{segStart}_{segEnd}.wav",format="wav")

            percentage, error = eagle_profiler.enroll(podcastSegment.raw_data)
            print(f"Progress: {percentage}, Segment: {segStart}:{segEnd}")
            speakerSegments+=1

    if percentage>=100:
        profileBytes = eagle_profiler.export().to_bytes()
        base64_bytes = base64.b64encode(profileBytes)
        base64_string = base64_bytes.decode("ascii") 

        hashSha256.update(profileBytes)
        profileIdSha256 = hashSha256.hexdigest()
        print(f"Profile({speakerIndexStr}) Id SHA256: {profileIdSha256}") 

        existingProfile = next(
                (item for item in jsonProfiles["Profiles"] if item['Sha256'] == profileIdSha256), None
            )
        if existingProfile:
            print(f"Profile recognized before: {existingProfile}")
            existingSource = next(
                    (item for item in existingProfile['Sources'] if item == sourceId), None
                )
            if existingSource==None:
                existingProfile['Sources'].append(sourceId)
        else:
            existingProfile = {"Sha256":profileIdSha256,"Base64":base64_string,"Sources":[sourceId]}
        
        jsonProfiles['Profiles'].append(existingProfile)
        print("---")
    # Continue to next even if not recognized
    speakerIndex+=1

with open('./profiles.json','w+') as fileProfiles:
    fileProfiles.write(json.dumps(jsonProfiles,indent=2))
