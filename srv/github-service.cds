using {cuid} from '@sap/cds/common';

service GitHubService {
  @cds.persistence.skip
  @readonly
  entity Issue : cuid {
    number : Integer;
    title  : String;
    state  : String;
    url    : String;
  }

  action createIssue(title : String, body : String) returns Issue;
}
