import uuid
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class AISynthesizeSectionView(APIView):
    """
    Synthesizes a declarative component JSON tree from a natural language prompt.
    """
    def post(self, request):
        prompt = request.data.get('prompt', '').strip()
        if not prompt:
            return Response({'error': 'Prompt is required'}, status=status.HTTP_400_BAD_REQUEST)

        prompt_lower = prompt.lower()
        section_id = f"sec_ai_{uuid.uuid4().hex[:6]}"
        container_id = f"cont_ai_{uuid.uuid4().hex[:6]}"
        heading_id = f"head_ai_{uuid.uuid4().hex[:6]}"
        desc_id = f"desc_ai_{uuid.uuid4().hex[:6]}"

        nodes = {}

        if 'pricing' in prompt_lower:
            grid_id = f"grid_ai_{uuid.uuid4().hex[:6]}"
            nodes[section_id] = {
                'id': section_id,
                'type': 'Section',
                'name': 'AI Pricing Section',
                'parentId': 'root',
                'children': [container_id],
                'props': {},
                'styles': {
                    'base': {
                        'display': 'block',
                        'backgroundColor': '#f8fafc',
                        'padding': {'top': '80px', 'right': '24px', 'bottom': '80px', 'left': '24px'}
                    }
                }
            }
            nodes[container_id] = {
                'id': container_id,
                'type': 'Container',
                'name': 'Pricing Container',
                'parentId': section_id,
                'children': [heading_id, desc_id, grid_id],
                'props': {},
                'styles': {
                    'base': {
                        'maxWidth': '1100px',
                        'margin': {'top': '0', 'right': 'auto', 'bottom': '0', 'left': 'auto'},
                        'display': 'flex',
                        'flexDirection': 'column',
                        'alignItems': 'center',
                        'gap': '28px'
                    }
                }
            }
            nodes[heading_id] = {
                'id': heading_id,
                'type': 'Heading',
                'name': 'Pricing Headline',
                'parentId': container_id,
                'children': [],
                'props': {'content': 'Transparent, Fair Pricing', 'level': 2},
                'styles': {'base': {'fontSize': '36px', 'fontWeight': '800', 'color': '#0f172a', 'textAlign': 'center'}}
            }
            nodes[desc_id] = {
                'id': desc_id,
                'type': 'Paragraph',
                'name': 'Pricing Subtitle',
                'parentId': container_id,
                'children': [],
                'props': {'content': 'Choose the plan designed for your team scale. Cancel anytime.'},
                'styles': {'base': {'fontSize': '16px', 'color': '#64748b', 'textAlign': 'center'}}
            }
            nodes[grid_id] = {
                'id': grid_id,
                'type': 'Container',
                'name': 'Pricing 3-Col Grid',
                'parentId': container_id,
                'children': [],
                'props': {},
                'styles': {
                    'base': {
                        'display': 'grid',
                        'gridTemplateColumns': 'repeat(3, minmax(0, 1fr))',
                        'gap': '24px',
                        'width': '100%'
                    }
                }
            }

            for tier, price in [('Starter', '$29'), ('Growth', '$79'), ('Enterprise', '$199')]:
                card_id = f"card_ai_{uuid.uuid4().hex[:6]}"
                btn_id = f"btn_ai_{uuid.uuid4().hex[:6]}"
                nodes[grid_id]['children'].append(card_id)
                nodes[card_id] = {
                    'id': card_id,
                    'type': 'Container',
                    'name': f"{tier} Tier Card",
                    'parentId': grid_id,
                    'children': [btn_id],
                    'props': {},
                    'styles': {
                        'base': {
                            'backgroundColor': '#ffffff',
                            'padding': {'top': '32px', 'right': '24px', 'bottom': '32px', 'left': '24px'},
                            'borderRadius': '12px',
                            'borderWidth': '1px',
                            'borderColor': '#e2e8f0',
                            'borderStyle': 'solid',
                            'display': 'flex',
                            'flexDirection': 'column',
                            'gap': '16px'
                        }
                    }
                }
                nodes[btn_id] = {
                    'id': btn_id,
                    'type': 'Button',
                    'name': f"Choose {tier}",
                    'parentId': card_id,
                    'children': [],
                    'props': {'label': f"Choose {tier} ({price}/mo)", 'href': '#signup'},
                    'styles': {
                        'base': {
                            'backgroundColor': '#4f46e5',
                            'color': '#ffffff',
                            'padding': {'top': '10px', 'right': '18px', 'bottom': '10px', 'left': '18px'},
                            'borderRadius': '8px',
                            'fontWeight': '600'
                        }
                    }
                }
        else:
            nodes[section_id] = {
                'id': section_id,
                'type': 'Section',
                'name': 'AI Section',
                'parentId': 'root',
                'children': [container_id],
                'props': {},
                'styles': {
                    'base': {
                        'display': 'block',
                        'backgroundColor': '#ffffff',
                        'padding': {'top': '70px', 'right': '24px', 'bottom': '70px', 'left': '24px'}
                    }
                }
            }
            nodes[container_id] = {
                'id': container_id,
                'type': 'Container',
                'name': 'Section Container',
                'parentId': section_id,
                'children': [heading_id, desc_id],
                'props': {},
                'styles': {
                    'base': {
                        'maxWidth': '900px',
                        'margin': {'top': '0', 'right': 'auto', 'bottom': '0', 'left': 'auto'},
                        'display': 'flex',
                        'flexDirection': 'column',
                        'alignItems': 'center',
                        'gap': '16px'
                    }
                }
            }
            nodes[heading_id] = {
                'id': heading_id,
                'type': 'Heading',
                'name': 'Section Heading',
                'parentId': container_id,
                'children': [],
                'props': {'content': prompt, 'level': 2},
                'styles': {'base': {'fontSize': '32px', 'fontWeight': '700', 'color': '#0f172a', 'textAlign': 'center'}}
            }
            nodes[desc_id] = {
                'id': desc_id,
                'type': 'Paragraph',
                'name': 'Section Description',
                'parentId': container_id,
                'children': [],
                'props': {'content': f"Synthesized based on your description: '{prompt}'. Edit any property directly in the canvas."},
                'styles': {'base': {'fontSize': '16px', 'color': '#475569', 'textAlign': 'center'}}
            }

        return Response({
            'root_section_id': section_id,
            'nodes': nodes
        }, status=status.HTTP_200_OK)
