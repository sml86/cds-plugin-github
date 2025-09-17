using {
  cuid,
  managed
} from '@sap/cds/common';

service GitHubService {
  @cds.persistence.skip
  @readonly
  entity Issue : cuid, managed {
    @title      : '{i18n>issue}'
    @UI.lineItem: [{
      $Type: 'UI.DataFieldWithUrl',
      Value: number,
      Url  : url,
    }]
    number            : Integer;

    @title: '{i18n>title}'
    title             : String;

    @title: '{i18n>status}'
    state             : String;

    @Core.IsURL
    @title      : '{i18n>url}'
    url               : String;

    @title: '{i18n>labels}'
    label             : String;

    @title: '{i18n>labels}'
    labels            : many Label;

    @title: '{i18n>assignees}'
    assignee          : String;

    @title: '{i18n>assignees}'
    assignees         : many User;

    @title: '{i18n>milestone}'
    milestone         : String;

    @title: '{i18n>description}'
    body              : String;

    @title: '{i18n>type}'
    type              : String;

    @title      : '{i18n>typeCriticality}'
    @UI.Hidden
    type_criticality  : Integer;

    @title      : '{i18n>statusCriticality}'
    @UI.Hidden
    state_criticality : Integer;
  }

  @title: '{i18n>createIssue}'
  action createIssue(
                     @title: '{i18n>title}'
                     @mandatroy
                     title: String(256),
                     @title: '{i18n>description}'
                     @mandatory
                     @UI.MultiLineText: true
                     body: String) returns Issue;

  type User {
    @title: '{i18n>name}'
    name  : String;

    @UI.IsImageURL
    image : String;
  }

  type Label {
    name        : String;
    description : String;
    color       : String;
    index       : Int32;
  }

  type IssueType : String enum {
    Task;
    Bug;
    Feature;
    PullRequest;
  };
}
