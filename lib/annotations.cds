using GitHubService as service from './github-service';

annotate service.Issue with @(
    UI.FieldGroup #IssueDetails: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataFieldWithUrl',
                Value: number,
                Url  : url,
            },
            {
                $Type: 'UI.DataField',
                Value: title,
            },
            {
                $Type                    : 'UI.DataField',
                Value                    : state,
                Criticality              : state_criticality,
                CriticalityRepresentation: #WithoutIcon
            },
            {
                $Type                    : 'UI.DataField',
                Value                    : type,
                Criticality              : type_criticality,
                CriticalityRepresentation: #WithoutIcon
            },
        ],
    },
    UI.Facets                  : [{
        $Type : 'UI.ReferenceFacet',
        ID    : 'IssueDetailsFacet',
        Label : '{i18n>issue}',
        Target: '@UI.FieldGroup#IssueDetails',
    }, ],
    UI.LineItem                : [
        {
            $Type: 'UI.DataFieldWithUrl',
            Value: number,
            Url  : url
        },
        {
            $Type                    : 'UI.DataField',
            Value                    : type,
            Criticality              : type_criticality,
            CriticalityRepresentation: #WithoutIcon,
        },
        {
            $Type: 'UI.DataField',
            Value: title,
        },
        {
            $Type                    : 'UI.DataField',
            Value                    : state,
            Criticality              : state_criticality,
            CriticalityRepresentation: #WithoutIcon,
        },
        {
            $Type: 'UI.DataField',
            Value: label,
        },
        {
            $Type: 'UI.DataField',
            Value: milestone,
        },
        {
            $Type: 'UI.DataField',
            Value: assignee,
        },
        {
            $Type : 'UI.DataFieldForAction',
            Action: 'GitHubService.EntityContainer/createIssue',
            Label : '{i18n>createIssue}',
        },
    ],
);
