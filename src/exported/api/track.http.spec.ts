import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TrackHttpClient, TrackClientConfig, trackClientConfigToken } from './track.http';

describe('TrackHttpClient', () => {

  let trackClient: TrackHttpClient;
  let testController: HttpTestingController;
  let config: TrackClientConfig;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        {
          provide: trackClientConfigToken,
          useValue: {
            urls: {
              upload: 'EXAMPLE_TRACK_UPLOAD_URL',
              delete: (id) => `EXAMPLE_TRACK_DELETION_URL/${id}`
            }
          }
        }
      ]
    });

    trackClient = TestBed.get(TrackHttpClient);
    testController = TestBed.get(HttpTestingController);
    config = TestBed.get(trackClientConfigToken);
  });

  it('should be created', () => {
    expect(trackClient).toBeTruthy();
  });

  describe('#upload', () => {
    it('sends a POST request to the configured endpoint', () => {
      trackClient.upload({
        contents: new File([], 'EXAMPLE_SELECTED_FILE_NAME'),
        name: 'EXAMPLE_FILE_NAME',
        bearerToken: 'EXAMPLE_BEARER_TOKEN'
      })
        .subscribe();

      testController.expectOne({ method: 'POST', url: config.urls.upload });
    });

    it('passes the provided file and filename in the request payload', () => {
      trackClient.upload({
        contents: new File([], 'EXAMPLE_SELECTED_FILE_NAME'),
        name: 'EXAMPLE_FILE_NAME',
        bearerToken: 'EXAMPLE_BEARER_TOKEN'
      })
        .subscribe();

      const expected = testController.expectOne('EXAMPLE_TRACK_UPLOAD_URL');
      const requestBody = expected.request.body as FormData;
      expect(requestBody.has('audio-file')).toBe(true);
      expect((requestBody.get('audio-file') as File).name).toBe('EXAMPLE_FILE_NAME');
      expect((requestBody.get('audio-file') as File).size).toEqual(0);

    });

    it('passes the provided bearer token in the Authorization header', () => {
      trackClient.upload({
        contents: new File([], 'EXAMPLE_SELECTED_FILE_NAME'),
        name: 'EXAMPLE_FILE_NAME',
        bearerToken: 'EXAMPLE_BEARER_TOKEN'
      })
        .subscribe();

      const expected = testController.expectOne('EXAMPLE_TRACK_UPLOAD_URL');
      const headers = expected.request.headers;
      expect(headers.get('Authorization')).toEqual('Bearer EXAMPLE_BEARER_TOKEN');
    });
  });

  describe('#delete', () => {

    let track: { id: string };
    let bearerToken: string;

    beforeEach(() => {
      track = {
        id: 'EXAMPLE_TRACK_ID',
      };
      bearerToken = 'EXAMPLE_BEARER_TOKEN';
    });

    it('makes a delete request to the configured url', () => {
      trackClient.delete({ track, bearerToken }).subscribe();
      testController.expectOne({
        method: 'DELETE',
        url: config.urls.delete(track.id)
      });
    });

    it('passes an Authorization header with the provided bearer token in the request', () => {
      trackClient.delete({ track, bearerToken }).subscribe();

      const expected = testController.expectOne(config.urls.delete(track.id));
      const headers = expected.request.headers;
      expect(headers.get('Authorization')).toEqual('Bearer EXAMPLE_BEARER_TOKEN');
    });

    it('emits the unmapped, deleted track when successful', (done) => {
      const responseTrack = {};

      trackClient.delete({ track, bearerToken }).subscribe((emitted) => {
        expect(emitted).toBe(responseTrack);
        done();
      });

      const expected = testController.expectOne(config.urls.delete(track.id));
      expected.flush({ track: responseTrack });
    });

    it('forwards an error when the request errors out', (done) => {
      trackClient.delete({ track, bearerToken }).subscribe(() => { },
        (error: ErrorEvent) => {
          expect(error.message)
            .toEqual('Http failure response for EXAMPLE_TRACK_DELETION_URL/EXAMPLE_TRACK_ID: 0 ');
          done();
        });

      const expected = testController.expectOne(config.urls.delete(track.id));
      expected.error(new ErrorEvent('EXAMPLE_ERROR'));
    });
  });
});
